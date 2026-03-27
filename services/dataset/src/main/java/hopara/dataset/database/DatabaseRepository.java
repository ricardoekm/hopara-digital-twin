package hopara.dataset.database;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Component;

import hopara.dataset.datasource.DataSourceRepository;

@Component
public class DatabaseRepository {    
    @Autowired
    DataSourceRepository dataSourceRepository;
    
    @Autowired
    DatabaseFactory databaseFactory;

    public Database getDatabase() {
        try {
            var dataSource = dataSourceRepository.getCurrent();
            return databaseFactory.create(dataSource.getType(), dataSource.shouldQuoteIdentifiers());
        } catch(EmptyResultDataAccessException e) {
            return new Postgres();
        }        
    }    
}
