package hopara.dataset.bean;

import java.beans.PropertyVetoException;
import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;

import hopara.dataset.database.Database;
import hopara.dataset.database.MultiTenantDatabase;
import hopara.dataset.pool.MultiTenantConnectionPool;

@Configuration
public class DataAccessFactory {

    @Value("${dataQueryTimeout:10000}")
    private int queryTimeout;

    @Bean
    @Primary
    public Database dataDatabase() {
        return new MultiTenantDatabase();
    }

    @Bean
    public MultiTenantConnectionPool dataConnectionPool() {
        return new MultiTenantConnectionPool(dataDatabase());
    }

    @Bean
    JdbcTemplate dataJdbcTemplate() throws PropertyVetoException, SQLException {
        var jdbcTemplate = new JdbcTemplate(dataConnectionPool());
        jdbcTemplate.setQueryTimeout(queryTimeout);
        return jdbcTemplate;
    }

    @Bean
    NamedParameterJdbcTemplate dataNamedJdbcTemplate() throws PropertyVetoException, SQLException {
        var namedJdbcTemplate = new NamedParameterJdbcTemplate(dataConnectionPool());
        namedJdbcTemplate.getJdbcTemplate().setQueryTimeout(queryTimeout);
        return namedJdbcTemplate;
    }

    @Bean
    NamedParameterJdbcTemplate longRunningDataNamedJdbcTemplate() throws PropertyVetoException, SQLException {
        var namedJdbcTemplate = new NamedParameterJdbcTemplate(dataConnectionPool());
        return namedJdbcTemplate;
    }
    
    @Bean
    PlatformTransactionManager dataTx() throws PropertyVetoException, SQLException {
        return new DataSourceTransactionManager(dataConnectionPool());
    }    
}
