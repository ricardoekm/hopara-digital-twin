package hopara.dataset.bean;

import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import hopara.dataset.database.DatabaseType;
import hopara.dataset.datasource.DataSource;
import hopara.dataset.datasource.DataSourceRepository;

@Component
public class DefaultTenantMigration {
    
    @Value("${env:notSet}")
    private String env;

    @Autowired
    Flyway flyway;

    @Autowired
    DataSourceRepository dataSourceRepository;

    @Value("${databaseServer}")
    private String server;

    @Value("${databaseUsername}")
    private String username;

    @Value("${databaseType:POSTGRES}")
    private DatabaseType databaseType;

    @Value("${databaseName}")
    private String databaseName;

    @Value("${databasePassword}")
    private String databasePassword;
    
    @EventListener(ApplicationReadyEvent.class)
    public void migrate() {    
        if ( env.equals("dev") ) {
            flyway.repair();
            flyway.migrate();

            if ( !dataSourceRepository.exists("hopara") ) {
                var dataSource = new DataSource();
                dataSource.setName("hopara");
                dataSource.setHost(server);
                dataSource.setType(databaseType);
                dataSource.setUsername(username);
                dataSource.setDatabase(databaseName);
                dataSource.setPassword(databasePassword);
                dataSource.setSchema("hopara_io,public");

                dataSourceRepository.save(dataSource);
            }

            if ( !dataSourceRepository.exists("sample") ) {
                var dataSource = new DataSource();
                dataSource.setName("sample");
                dataSource.setHost(server);
                dataSource.setType(databaseType);
                dataSource.setUsername(username);
                dataSource.setDatabase(databaseName);
                dataSource.setPassword(databasePassword);
                dataSource.setSchema("hopara_io,public");

                dataSourceRepository.save(dataSource);
            }
        }
    }
}
