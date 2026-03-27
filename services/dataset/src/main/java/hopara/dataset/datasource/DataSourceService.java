package hopara.dataset.datasource;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.support.JdbcUtils;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import hopara.dataset.database.DatabaseFactory;
import hopara.dataset.pool.ConnectionPoolFactory;
import hopara.dataset.pool.MultiTenantConnectionPool;

import java.sql.Connection;

@Transactional
@Component
public class DataSourceService {

    @Autowired
    DataSourceRepository dataSourceRepository;
    
    @Autowired
    ConnectionPoolFactory connectionPoolFactory;

    @Autowired
    DatabaseFactory databaseFactory;

    @Autowired
    MultiTenantConnectionPool connectionPool;
    
    private void validate(DataSource dataSource) {        
        Connection connection = null;

        try {
            var database = databaseFactory.create(dataSource.getType(), dataSource.shouldQuoteIdentifiers());
            var connectionPool = connectionPoolFactory.create(dataSource, database, true, "temp#" + dataSource.getName());
            connection = connectionPool.getConnection();
        } catch(Throwable e ) {
            var messages = new ArrayList<String>();
            
            do {
                messages.add(e.getMessage());
                e = e.getCause();
            } while( e!= null );             
            
            throw new IllegalArgumentException("Couldn't connect to data base: " + String.join(" -> ", messages), e);
        } finally {
            JdbcUtils.closeConnection(connection);
        }
    }
    
    public void save(DataSource dataSource, Boolean persist) {
        if ( !dataSource.hasPassword() && dataSource.requiresPassword() ) {
            try {
                dataSource.setPassword(dataSourceRepository.findPassword(dataSource.getName()));
            }   
            catch(Exception e) {
                throw new IllegalArgumentException("Password must be supplied!");
            }     
        }

        validate(dataSource);

        if ( persist != null && persist == false ) {
            return;
        }

        dataSourceRepository.save(dataSource);
        
        dataSourceRepository.setCurrentName(dataSource.getName());
        connectionPool.reset();
    }

    public void clone(String source, String target) {
        dataSourceRepository.clone(source, target);
    }

    public void save(DataSource dataSource) {
        save(dataSource, true);
    }

    public Iterable<DataSource> list() {
        return dataSourceRepository.list();
    }

    public void setCurrentName(String name) {
        dataSourceRepository.setCurrentName(name);
    }

    public DataSource findNoPassword(String name) {
        return dataSourceRepository.findByNameWithoutPassword(name);
    }

    public void delete(String name) {
        dataSourceRepository.delete(findNoPassword(name));
    }

    public void deleteAll() {
        dataSourceRepository.deleteAll();
    }
}
