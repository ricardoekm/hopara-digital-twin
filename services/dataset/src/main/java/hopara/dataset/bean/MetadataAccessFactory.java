package hopara.dataset.bean;

import java.beans.PropertyVetoException;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Scope;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;

import com.mchange.v2.c3p0.ComboPooledDataSource;

import hopara.dataset.database.DatabaseType;
import hopara.dataset.database.Postgres;
import hopara.dataset.migration.FlywayFactory;
import hopara.dataset.row.converter.ArrayConverter;
import hopara.dataset.web.TenantService;

@Configuration
public class MetadataAccessFactory {

    @Value("${databaseServer}")
    private String server;

    @Value("${defaultTenant:hopara.io}")
    private String defaultTenant;

    @Value("${databaseUsername}")
    private String username;

    @Value("${databaseType:POSTGRES}")
    private DatabaseType databaseType;

    @Value("${databaseName}")
    private String databaseName;

    @Value("${databasePort:5432}")
    private Integer port;

    @Value("${databasePassword}")
    private String password;

    @Value("${metadataPoolInitialSize:1}")
    private int initialPoolsize;

    @Value("${metadataPoolMaxSize:50}")
    private int maxPoolsize;

    @Value("${metadataPoolMinSize:1}")
    private int minPoolsize;

    @Value("${metadataPoolMaxIdleTime:3600}")
    private int maxIdleTime;

    @Value("${metadataPoolIdleConnectionTestPeriod:60}")
    private int idleConnectionTestPeriod;

    @Value("${metadataPoolNumHelperThreads:50}")
    private int numHelperThreads;

    @Value("${metadataQueryTimeout:60}")
    private int queryTimeout;

    @Value("${metadataPoolCheckoutTimeout:5000}")
    private int checkoutTimeOut;

    @Autowired
    private FlywayFactory flywayFactory;

    @Bean
    public Postgres metadataDatabase() {
        return new Postgres();
    }
    
    @Bean
    public ArrayConverter arrayConverter() {
        return metadataDatabase().getArrayConverter();
    }
    
    @Bean
    public ArrayConverter numberArrayConverter() {
        return metadataDatabase().getNumberArrayConverter();
    }
    
    @Bean
    @Primary
    public DataSource metadataConnectionPool() throws PropertyVetoException, SQLException {
        var dataSource = new hopara.dataset.datasource.DataSource();
        dataSource.setHost(server);
        dataSource.setPort(port);
        dataSource.setDatabase(databaseName);
        dataSource.setSchema("hopara_io,public");

        ComboPooledDataSource connectionPool = new ComboPooledDataSource();
        connectionPool.setDataSourceName("hopara#metadata");
        connectionPool.setDriverClass(metadataDatabase().getDriverClass());
        connectionPool.setJdbcUrl(metadataDatabase().getJdbcUrl(dataSource));
        connectionPool.setCheckoutTimeout(checkoutTimeOut);
        connectionPool.setUser(username);
        connectionPool.setPassword(password);
        connectionPool.setInitialPoolSize(initialPoolsize);
        connectionPool.setMaxPoolSize(maxPoolsize);
        connectionPool.setMinPoolSize(minPoolsize);
        connectionPool.setMaxIdleTimeExcessConnections(maxIdleTime);
        connectionPool.setTestConnectionOnCheckin(true);
        connectionPool.setIdleConnectionTestPeriod(idleConnectionTestPeriod);
        connectionPool.setNumHelperThreads(numHelperThreads);

        return connectionPool;
    }

    @Bean
    @Primary
    JdbcTemplate metadataJdbcTemplate() throws PropertyVetoException, SQLException {
        var jdbcTemplate = new JdbcTemplate(metadataConnectionPool());
        jdbcTemplate.setQueryTimeout(queryTimeout);
        return jdbcTemplate;
    }

    @Bean
    // When we need to skip the set user authorization on SetDatabaseUserAdvice
    JdbcTemplate privilegedMetadataJdbcTemplate() throws PropertyVetoException, SQLException {
        return new JdbcTemplate(metadataConnectionPool());
    }

    @Bean
    @Primary
    NamedParameterJdbcTemplate metadataNamedJdbcTemplate() throws PropertyVetoException, SQLException {
        var namedJdbcTemplate = new NamedParameterJdbcTemplate(metadataConnectionPool());
        namedJdbcTemplate.getJdbcTemplate().setQueryTimeout(queryTimeout);
        return namedJdbcTemplate;
    }

    @Bean
    @Scope("prototype")
    SimpleJdbcInsert simpleJdbcInsert() throws PropertyVetoException, SQLException {
        return new SimpleJdbcInsert(metadataConnectionPool());
    }

    @Bean
    @Primary
    PlatformTransactionManager metadataTx() throws PropertyVetoException, SQLException {
        return new DataSourceTransactionManager(metadataConnectionPool());
    } 
    
    @Bean
    Flyway flyway() throws PropertyVetoException, SQLException {
        return flywayFactory.create(TenantService.sanitize(defaultTenant), metadataConnectionPool());
    }
}
