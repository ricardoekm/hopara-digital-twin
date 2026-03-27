package hopara.dataset;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
public class TransactionManagerFactory {

    @Autowired
    @Qualifier("dataConnectionPool")
    DataSource dataConnectionPool;
    
    @Autowired
    @Qualifier("metadataConnectionPool")
    DataSource metadataConnectionPool;
    
    @Bean
    @SuppressWarnings("deprecation")
    PlatformTransactionManager composedTransactionManager() {
        return new org.springframework.data.transaction.ChainedTransactionManager(new DataSourceTransactionManager(dataConnectionPool),
                                                                                  new DataSourceTransactionManager(metadataConnectionPool));
    }
}
