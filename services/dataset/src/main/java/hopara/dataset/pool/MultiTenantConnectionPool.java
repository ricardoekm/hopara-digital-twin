package hopara.dataset.pool;

import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.SQLFeatureNotSupportedException;
import java.util.HashMap;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.logging.Logger;

import org.apache.commons.lang3.tuple.Pair;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import com.mchange.v2.c3p0.ComboPooledDataSource;

import hopara.dataset.database.Database;
import hopara.dataset.datasource.DataSource;
import hopara.dataset.datasource.DataSourceRepository;
import hopara.dataset.web.TenantService;

public class MultiTenantConnectionPool implements javax.sql.DataSource {

    @Autowired
    TenantService tenantService;
    
    @Autowired
    DataSourceRepository dataSourceRepository;
    
    @Autowired
    Database database;

    @Autowired
    ConnectionPoolFactory connectionPoolFactory;

    private Log logger = LogFactory.getLog(MultiTenantConnectionPool.class);
    
    @Value("${defaultTenant:hopara.io}")
    private String defaultTenant;

    HashMap<String, Pair<DataSource,ComboPooledDataSource>> connectionPools = new HashMap<String, Pair<DataSource,ComboPooledDataSource>>(); 

    private static final ConcurrentMap<String, Object> createPoolsLocks = new ConcurrentHashMap<>();

    public MultiTenantConnectionPool(Database database) {
        this.database = database;
    }
    
    private String getPoolId() {
        return tenantService.getTenant() + "#" + dataSourceRepository.getCurrentName();
    }

    private void addConnectionPool() {
        if ( connectionPools.get(getPoolId()) != null) {
            return;
        }

        if ( dataSourceRepository.currentExists() ) {
            logger.info("No connection pool available for " + getPoolId() + ". Creating new...");
            var dataSource = dataSourceRepository.getCurrentWithPassword();
            var connectionPool = connectionPoolFactory.create(dataSource, database, getPoolId());
            
            connectionPools.put(getPoolId(), Pair.of(dataSource, connectionPool));
        }
        else {
            throw new IllegalArgumentException("Datasource " + dataSourceRepository.getCurrentName() + " not found for tenant " + tenantService.getTenant());   
        }  
    }

    private void syncronizedAddConnectionPool() {
        var createPoolLock = createPoolsLocks.computeIfAbsent(getPoolId(), _ -> new Object());
        synchronized (createPoolLock)
        {
            addConnectionPool();
        }
    }

    private ComboPooledDataSource getConnectionPool() {
        if ( connectionPools.get(getPoolId()) == null ) {
            syncronizedAddConnectionPool();
        }
        else {
            if ( dataSourceRepository.currentExists() ) {
                var dataSource = connectionPools.get(getPoolId()).getLeft();
                if ( !dataSource.equals(dataSourceRepository.getCurrentWithPassword()) ) {
                    reset();
                    syncronizedAddConnectionPool();
                }
            }
        }
        
        return connectionPools.get(getPoolId()).getValue();
    }
    
    public void reset() {
        var pool = connectionPools.get(getPoolId());
        if ( pool != null ) {
            pool.getValue().close();
        }
        
        connectionPools.put(getPoolId(), null);
    }
    
    @Override
    public Logger getParentLogger() throws SQLFeatureNotSupportedException {
        return getConnectionPool().getParentLogger();
    }

    @Override
    public <T> T unwrap(Class<T> iface) throws SQLException {
        return getConnectionPool().unwrap(iface);
    }

    @Override
    public boolean isWrapperFor(Class<?> iface) throws SQLException {
        return getConnectionPool().isWrapperFor(iface);
    }

    @Override
    public Connection getConnection() throws SQLException {
        return getConnectionPool().getConnection();
    }

    @Override
    public Connection getConnection(String username, String password) throws SQLException {
        return getConnectionPool().getConnection(username, password);
    }

    @Override
    public PrintWriter getLogWriter() throws SQLException {
        return getConnectionPool().getLogWriter();
    }

    @Override
    public void setLogWriter(PrintWriter out) throws SQLException {
        getConnectionPool().setLogWriter(out);
    }

    @Override
    public void setLoginTimeout(int seconds) throws SQLException {
        getConnectionPool().setLoginTimeout(seconds);
    }

    @Override
    public int getLoginTimeout() throws SQLException {
        return getConnectionPool().getLoginTimeout();
    }
}
