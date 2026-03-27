package hopara.dataset.migration;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

@Component
public class MigrationService {
    @Autowired
    FlywayFactory flywayFactory;

    @Autowired
    DataSource metadataConnectionPool;

    @Autowired
    @Qualifier("privilegedMetadataJdbcTemplate")
    JdbcTemplate jdbcTemplate;

    private Log log = LogFactory.getLog(MigrationService.class);

    public void migrate(String schema, String user) {
        log.info("Migrating " + schema);

        var flyway = flywayFactory.create(schema, metadataConnectionPool);
        flyway.repair();
        flyway.migrate();
    }
}
