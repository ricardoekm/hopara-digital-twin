package hopara.dataset.table;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import hopara.dataset.database.Database;
import hopara.dataset.datasource.DataSourceRepository;

@Component
@Transactional
public class TableService {

    private Log log = LogFactory.getLog(TableService.class);
		
	@Autowired
	private TableRepository tableRepository;

    @Autowired
    Database database;

    @Autowired
    DataSourceRepository dataSourceRepository;

    @Autowired
    IndexRepository indexRepository;
	
	public void save(Table table) {	   
        log.info("Creating table " + table.getName());                
        tableRepository.save(table);
    }
	
    @Transactional(readOnly = true)
	public Table find(TableKey key) {
	    return tableRepository.find(key);
	}

    public void createIndex(String tableName, String columnName) {
        indexRepository.createIndex(tableName, columnName);
    }

    public void createUniqueConstraint(String tableName, List<String> columnNames) {
        indexRepository.createUniqueConstraint(tableName, columnNames);
    }

    public void delete(Table table) {
        tableRepository.delete(table);
    }
	
    public void delete(TableKey key) {
	    delete(tableRepository.find(key));
	}
	
    @Transactional(readOnly = true)
    public Boolean has(TableKey key) {
        return tableRepository.has(key);
    }
}
