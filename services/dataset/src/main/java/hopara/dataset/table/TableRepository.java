package hopara.dataset.table;

import java.sql.Connection;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DataSourceUtils;
import org.springframework.stereotype.Component;

import hopara.dataset.NotFoundException;
import hopara.dataset.column.Columns;
import hopara.dataset.column.QueryColumnRepository;
import hopara.dataset.database.Database;
import hopara.dataset.datasource.DataSourceRepository;
import hopara.dataset.sqlquery.SqlQuery;
import java.sql.DatabaseMetaData;
import java.sql.SQLException;

@Component
public class TableRepository {

    @Autowired
    @Qualifier("dataJdbcTemplate")
    private JdbcTemplate dataJdbcTemplate;

    @Autowired
    IndexRepository indexRepository;

    @Autowired
    DataSourceRepository dataSourceRepository;

    @Autowired
    QueryColumnRepository queryColumnRepository;

    @Autowired
    TableFactory tableFactory;

    @Autowired
    Database database;

    public static final String CACHE_NAME = "tables";

    private Table findFromDatabase(TableKey key) {
        var table = tableFactory.create(key.getDataSourceName(), key.getName());
        if (!hasPhysicalTable(table.getName())) {
            throw new NotFoundException(table.getName());
        }

        var query = new SqlQuery("SELECT * FROM " + table.getSqlName(), database.getDbClass());
        var columns = queryColumnRepository.getFromQuery(query);
        table.setColumns(columns);
        return table;
    }

    @Cacheable(CACHE_NAME)
    public Table find(TableKey key) {
        return findFromDatabase(key);
    }

    public Boolean has(TableKey key) {
        try {
            this.find(key);
            return true;
        } catch (NotFoundException e) {
            return false;
        }
    }

    public void delete(Table table) {
        var dropTable = "DROP TABLE IF EXISTS " + table.getSqlName() + ";";
        dataJdbcTemplate.update(dropTable);
    }

    public void create(Table table) {
        var sql = "CREATE ";
        sql += " TABLE ";
        sql += table.getSqlName() + " (";
        sql += String.join(",", table.getColumns().getDDLs(database));
        sql += ")";

        dataJdbcTemplate.update(sql);
    }

    public void save(Table table) {
        try {
            create(table);
            indexRepository.createSpatialIndices(table);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public Boolean hasPhysicalTable(String physicalTableName) {
        var connection = DataSourceUtils.getConnection(dataJdbcTemplate.getDataSource());
        return hasPhysicalTable(physicalTableName, connection);
    }

    private Boolean hasTableInSchema(String schema, String physicalTableName, DatabaseMetaData metadata) throws SQLException {
        var tables = metadata.getTables(null, schema, physicalTableName, null);
        return tables.next();
    }

    private Boolean hasPhysicalTable(String physicalTableName, Connection connection) {
        try {
            var schemas = dataSourceRepository.getCurrent().getSchemas();
            var metadata = connection.getMetaData();
            
            if (schemas.isEmpty()) {
                return hasTableInSchema(null, physicalTableName, metadata) || 
                       hasTableInSchema(null, physicalTableName.toLowerCase(), metadata);
            }

            for (var schema : schemas) {
                if ( hasTableInSchema(schema, physicalTableName, metadata) || 
                     hasTableInSchema(schema, physicalTableName.toLowerCase(), metadata)) {
                    return true;
                }
            }

            return false;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public String getAddColumnsSql(Table table, Columns columnsToAdd) {
        String sql = "ALTER TABLE " + table.getSqlName() + " ";

        var addColumnsStatements = new ArrayList<String>();
        for (var column : columnsToAdd) {
            addColumnsStatements.add("ADD COLUMN " + column.getDDL(database));
        }

        return sql + String.join(",", addColumnsStatements) + ";";
    }
}
