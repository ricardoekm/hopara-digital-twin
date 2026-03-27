package hopara.dataset.pool;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.mchange.v2.c3p0.ComboPooledDataSource;

import hopara.dataset.database.Database;
import hopara.dataset.datasource.DataSource;

@Component
public class ConnectionPoolFactory {
    @Value("${dataPoolMaxSize:14}")
    private int maxPoolsize;

    @Value("${dataPoolIdleConnectionTestPeriod:60}")
    private int idleConnectionTestPeriod;

    @Value("${dataPoolMaxIdleTime:36000}")
    private int maxIdleTime;

    @Value("${dataPoolNumHelperThreads:14}")
    private int numHelperThreads;
    
    @Value("${dataPoolAcquireRetryAttempts:2}")
    private int acquireRetryAttempts;

    @Value("${dataPoolCheckoutTimeout:10000}")
    private int checkoutTimeOut;

    @Value("${nodeCount:2}")
    private int nodeCount = 2;

    public ComboPooledDataSource create(DataSource dataSource, Database database, Boolean testPool, String poolName) {
        try {
            ComboPooledDataSource connectionPool = new ComboPooledDataSource();

            connectionPool.setDataSourceName(poolName);
            connectionPool.setDriverClass(database.getDriverClass());
            connectionPool.setJdbcUrl(database.getJdbcUrl(dataSource));  
            connectionPool.setCheckoutTimeout(checkoutTimeOut);

            connectionPool.setUser(dataSource.getUsername());
            connectionPool.setPassword(dataSource.getPassword());
            connectionPool.setInitialPoolSize(dataSource.getMinConnections());
            connectionPool.setMinPoolSize(dataSource.getMinConnections());

            if ( dataSource.hasMaxConnections() ) {
                // Java deserves to die
                var maxPoolSizePerNode = (int)Math.ceil(((double)dataSource.getMaxConnections())/nodeCount);
                connectionPool.setMaxPoolSize(maxPoolSizePerNode);
            }
            else {
                connectionPool.setMaxPoolSize(maxPoolsize);
            }

            connectionPool.setMaxIdleTimeExcessConnections(maxIdleTime);
            connectionPool.setAcquireRetryAttempts(acquireRetryAttempts);    

            // The test pool has no retry to validate quicker if the database is available
            if ( testPool ) {
                connectionPool.setInitialPoolSize(1);
                connectionPool.setMinPoolSize(1);
                connectionPool.setMaxPoolSize(1);

                connectionPool.setAcquireRetryAttempts(1);    
                connectionPool.setAcquireRetryDelay(0);
                connectionPool.setJdbcUrl(database.getTestJdbcUrl(dataSource));                
            }

            connectionPool.setAcquireRetryAttempts(acquireRetryAttempts);
            connectionPool.setTestConnectionOnCheckin(true);
            connectionPool.setIdleConnectionTestPeriod(idleConnectionTestPeriod);
            connectionPool.setNumHelperThreads(numHelperThreads);
            
            return connectionPool;     
        }
        catch(Exception e) {
            throw new RuntimeException(e);
        }
    }

    public ComboPooledDataSource create(DataSource dataSource, Database database, String poolName) {
        return create(dataSource, database, false, poolName);
    }
}
