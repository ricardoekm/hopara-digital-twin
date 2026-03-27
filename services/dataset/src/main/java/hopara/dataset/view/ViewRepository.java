package hopara.dataset.view;

import java.util.ArrayList;
import java.util.HashMap;
import javax.annotation.PostConstruct;
import javax.sql.rowset.serial.SerialException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.jdbc.UncategorizedSQLException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.jdbc.support.rowset.SqlRowSetMetaData;
import org.springframework.stereotype.Component;

import hopara.dataset.NotFoundException;
import hopara.dataset.column.ColumnRepository;
import hopara.dataset.column.TypeHint;
import hopara.dataset.database.Database;
import hopara.dataset.database.DatabaseType;
import hopara.dataset.datasource.DataSource;
import hopara.dataset.datasource.DataSourceRepository;
import hopara.dataset.row.converter.PostgresJsonConverter;
import hopara.dataset.row.read.BaseViewSqlBuilder;
import hopara.dataset.stats.column.ColumnStatsRepository;
import hopara.dataset.table.TableKey;
import hopara.dataset.table.TableRepository;
import hopara.dataset.table.Tables;
import hopara.dataset.web.TenantService;

@Component
public class ViewRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Autowired
    @Qualifier("dataJdbcTemplate")
    private JdbcTemplate dataJdbcTemplate;

    @Autowired
    @Qualifier("dataNamedJdbcTemplate")
    private NamedParameterJdbcTemplate dataNamedJdbcTemplate;

    @Autowired
    private ColumnRepository columnRepository;

    @Autowired
    private ViewColumnsMapper viewColumnsMapper;
   
    @Autowired
    private TableRepository tableRepository;
    
    @Autowired
    private SimpleJdbcInsert simpleJdbcInsert;

    @Autowired
    private ColumnStatsRepository columnStatsRepository;

    @Autowired
    PostgresJsonConverter jsonConverter;

    @Autowired
    Database database;

    @Autowired
    DataSourceRepository dataSourceRepository;

    @Autowired
    TenantService tenantService;
    
    public static final String CACHE_NAME = "views";
    
    @PostConstruct
    public void configInsert() {
        simpleJdbcInsert.withTableName("hp_views")
                        .withoutTableColumnMetaDataAccess()
                        .usingColumns(new String[]{"id","name", "write_table_name","primary_key_name","query",
                                                   "filter_tables", "data_source_name", "version_column_name",
                                                   "write_level", "upsert", "smart_load", "editable_columns", "view_join"});
    }   
    
    @Cacheable(CACHE_NAME)
    public Tables getTables(View view) {        
        var queryTables = new Tables();
        for ( var tableNames : view.getSqlQuery().getTableNames() ) {
            var tableKey = new TableKey(view.getDataSourceName(), tableNames);
            if ( tableRepository.has(tableKey) ) {
               queryTables.add(tableRepository.find(tableKey));
            }
        }
        
        return queryTables;
    }

    @CacheEvict(cacheNames= {CACHE_NAME, BaseViewSqlBuilder.CACHE_NAME}, allEntries=true)
    public void save(View view) {        
        var params = new HashMap<String, Object>();
        params.put("id", view.getId());
        params.put("name", view.getName());
        params.put("write_table_name", view.getWriteTableName());
        params.put("primary_key_name", view.getPrimaryKeyName());
        params.put("version_column_name", view.getVersionColumnName());
        params.put("data_source_name", view.getDataSourceName());
        params.put("query", view.getQuery());
        params.put("write_level", view.getWriteLevel().toString());
        params.put("upsert", view.shouldUpsert());
        params.put("filter_tables", view.shouldFilterTables());
        params.put("smart_load", view.getSmartLoad());
        params.put("view_join", view.getJoin());
        params.put("editable_columns", jsonConverter.toDatabaseFormat(view.getEditableColumns(), TypeHint.NONE));

        simpleJdbcInsert.execute(params);         
        
        if ( view.hasColumns() ) {
            columnRepository.save(view.getColumns(), view.getId());
        } 
    }

    @CacheEvict(cacheNames= {CACHE_NAME, BaseViewSqlBuilder.CACHE_NAME}, allEntries=true)
    public void upsert(View view) {    
        delete(view);      
        save(view);
    }

    private String getViewColumnsQuery() {
        return "SELECT v.name as view_name, v.data_source_name as view_data_source_name, v.query as view_query, v.data_source_name as view_data_source_name,"
                + "v.view_join as view_join, v.write_table_name as view_write_table_name, v.primary_key_name as view_primary_key_name, v.editable_columns as view_editable_columns, " 
                + "v.filter_tables as view_filter_tables, v.write_level as view_write_level, v.upsert as view_upsert, v.smart_load as view_smart_load, v.row_count as view_row_count, "
                + "v.version_column_name as view_version_column_name, c.name as column_name, c.type as column_type, "
                + columnStatsRepository.getStatsFields()
                + " FROM hp_views AS v" 
                + " LEFT JOIN hp_columns AS c ON v.id = c.view_id ";
    }

    @Cacheable(CACHE_NAME)
    public View find(ViewKey key) {
        var searchQuery = getViewColumnsQuery() + " WHERE v.id = ? ";
        var views = jdbcTemplate.query(searchQuery, viewColumnsMapper, key.getId());
        if (views.size() == 0) {
            throw new NotFoundException(key.toString());
        }
        
        var view = views.iterator().next();
        if ( view.hasJoin() ) {
            var joinedViews = jdbcTemplate.query(searchQuery, viewColumnsMapper, view.getJoin());
            if (joinedViews.size() > 0) {
                var joinedView = joinedViews.iterator().next();
                view.addColumns(joinedView.getColumns());
            }
        }

        return view;
    }
    
    @Cacheable(CACHE_NAME)
    public Views find() {
        return jdbcTemplate.query( getViewColumnsQuery()
                                   + " WHERE NOT (v.data_source_name = ? AND v.name like '\\_%')"
                                   + " ORDER BY v.name, c.name",
                                   viewColumnsMapper,
                                   DataSource.DEFAULT_NAME);
    }

    public Views search(String queryText, String dataSource) {
        return jdbcTemplate.query( getViewColumnsQuery()
                                   + " WHERE query ILIKE ? AND "
                                   + " data_source_name = ?" 
                                   + " ORDER BY v.name, c.name",
                                   viewColumnsMapper, 
                                   "%" + queryText + "%",
                                   dataSource);
    }

    @Cacheable(CACHE_NAME)
    public Views findByDataSource(String dataSourceName) {
        return jdbcTemplate.query( getViewColumnsQuery()
                                   + " WHERE data_source_name = ?" 
                                   + " ORDER BY v.name, c.name",
                                   viewColumnsMapper, 
                                   dataSourceName);
    }

    @CacheEvict(cacheNames=CACHE_NAME, allEntries = true)
    public void delete(View view) {
        columnRepository.delete(view);

        String deleteViewJoins = "UPDATE hp_views SET view_join = NULL WHERE view_join = ?";
        jdbcTemplate.update(deleteViewJoins, new Object[]{view.getId()});

        String deleteViewQuery = "DELETE FROM hp_views WHERE id = ?";
        jdbcTemplate.update(deleteViewQuery, new Object[]{view.getId()});
    }
    
    // Used for tests only
    @CacheEvict(cacheNames=CACHE_NAME, allEntries=true)
    public int deleteAll(String startsWith) {
        var views = find();
        for ( var view : views ) {
            if ( view.getName().startsWith(startsWith) ) {
                delete( view );
            }
        }
        
        return views.size();
    }

    @Cacheable(value=CACHE_NAME,unless="#result == false")
    public Boolean has(ViewKey viewKey) {
        try {
            this.find(viewKey);
            return true;
        }
        catch(NotFoundException e) {
            return false;
        }
    }

    private void validateWrite(View view) {
        if ( view.getPrimaryKeyName() == null ) {
            throw new IllegalArgumentException("Primary key not set");   
        }

        if (!view.hasWriteTable()) {
            throw new IllegalArgumentException("Write table not set");
        }

        if ( !tableRepository.has(view.getWriteTableKey()) ) {
            throw new IllegalArgumentException("Write table not found " + view.getWriteTableKey());
        }

        var writeTable = tableRepository.find(view.getWriteTableKey());
        if ( !writeTable.getColumns().contains(view.getPrimaryKeyName()) ) {
            throw new IllegalArgumentException("Primary key not found: " + view.getWriteTableKey() + "/" + view.getPrimaryKeyName());   
        }

        if ( view.hasVersionColumn() ) {
            if ( !writeTable.getColumns().contains(view.getVersionColumnName()) ) {
                throw new IllegalArgumentException("Version column not found: " + view.getWriteTableKey() + "/" + view.getVersionColumnName());   
            }
        }

        if ( !view.getColumns().contains(view.getPrimaryKeyName()) ) {
            throw new IllegalArgumentException("Write column " + view.getPrimaryKeyName() + " should be returned in the query");
        }
    }

    private void checkDuplicateColumnNames(SqlRowSetMetaData metadata) {
        var names = new ArrayList<String>();
        for ( int i = 1; i <= metadata.getColumnCount(); i++) {
            var name = metadata.getColumnName(i);

            if ( names.contains(name) ) {
                throw new IllegalArgumentException("Duplicate column name found: " + name);
            }

            names.add(name);
        }
    }

    public void validate(View view) {
		view.validate();

        if ( database.isType(DatabaseType.DUCKDB) && !view.getEditableColumns().isEmpty() ) {
            throw new IllegalArgumentException("Can't edit columns on DuckDB");
        } 

        if ( view.getWriteLevel() != WriteLevel.NONE ) {
            validateWrite(view);
        }
        
        var query = view.getSqlQuery();
        query.setLimit(1);

        try {
            var rowset = dataNamedJdbcTemplate.getJdbcTemplate().queryForRowSet(query.toString());
            checkDuplicateColumnNames(rowset.getMetaData());
        }
        catch(UncategorizedSQLException e) {
            if ( e.getCause() instanceof SerialException ) {
                // Weird error with queryForRowSet + DuckDB + JSON + arrays
                // javax.sql.rowset.serial.SerialException: Cannot instantiate a SerialArray object with null parameters
                // at java.sql.rowset/javax.sql.rowset.serial.SerialStruct.<init>(SerialStruct.java:122)
            }
            else {
                throw e;
            }
        }
    }
}
