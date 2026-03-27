package hopara.dataset.entitytable;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import hopara.dataset.NotFoundException;
import hopara.dataset.datasource.DataSource;
import hopara.dataset.datasource.DataSourceRepository;
import hopara.dataset.table.TableRepository;

@Component
@Transactional
public class EntityRepository {
    @Autowired
    private DataSourceRepository dataSourceRepository;

    @Autowired
    private TableRepository tableRepository;

    @Autowired
    private SimpleJdbcInsert simpleJdbcInsert;

    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @PostConstruct
    public void configInsert() {
        simpleJdbcInsert.withTableName("hp_entity_tables")
                        .withoutTableColumnMetaDataAccess()
                        .usingColumns(new String[]{"name"});
    }  

    private void saveMetaData(EntityTable entityTable) {
        var params = new HashMap<String, Object>();
        params.put("name", entityTable.getName());
        simpleJdbcInsert.execute(params);
    }

    public void save(EntityTable entityTable) {
        try {
            saveMetaData(entityTable);

            dataSourceRepository.setCurrentName(DataSource.DEFAULT_NAME);
            if ( !tableRepository.has(entityTable.getKey()) ) {
                tableRepository.save(entityTable);
            }
        } catch(DuplicateKeyException e) {
            throw new IllegalArgumentException("Entity table already exists: " + entityTable.getName());
        }
    }

    public EntityTable find(String name) {
        if (has(name)) {
            return new EntityTable(name);
        }

        throw new NotFoundException(name);
    }

    public Boolean has(String name) {
        try {
            jdbcTemplate.queryForObject("SELECT name FROM hp_entity_tables WHERE name = ?", String.class, name);
            return true;
        } catch(EmptyResultDataAccessException e) {
            return false;
        }
    }

    public List<EntityTable> find() {
        var tableNames = jdbcTemplate.queryForList("SELECT name FROM hp_entity_tables", String.class);
        var entityTables = new ArrayList<EntityTable>();
        for ( var tableName : tableNames ) {
            entityTables.add(new EntityTable(tableName));
        }
        return entityTables;        
    }

    // Used for tests only
    public int deleteAll() {
        var tables = find();
        for ( var table : tables ) {
            delete( table.getName() );
        }
        
        return tables.size();
    }

    public void delete(String name) {
        if ( !has(name) ) {
            throw new NotFoundException(name);
        }

        jdbcTemplate.update("DELETE FROM hp_entity_tables WHERE name = ?", name);

        dataSourceRepository.setCurrentName(DataSource.DEFAULT_NAME);
        tableRepository.delete(new EntityTable(name));
    }
}
