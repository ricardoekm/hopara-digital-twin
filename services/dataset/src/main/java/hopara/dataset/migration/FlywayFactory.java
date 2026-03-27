package hopara.dataset.migration;

import javax.sql.DataSource;

import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;


@Component
public class FlywayFactory {

    @Value("${flywayConnectRetries:0}")
    private int connectRetries;

    public Flyway create(String schema, DataSource dataSource) {
        return Flyway.configure()
                     .dataSource(dataSource)
                     .connectRetries(connectRetries)
                     .table("hp_fw_dataset")
                     .createSchemas(false)
                     .baselineOnMigrate(true)
                     .failOnMissingLocations(true)
                     .defaultSchema(schema)
                     .schemas(new String[] {schema})
                     .load();
        
    }
}
