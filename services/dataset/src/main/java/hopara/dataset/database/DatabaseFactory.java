package hopara.dataset.database;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import hopara.dataset.web.TenantService;

@Component
public class DatabaseFactory {
    @Autowired
    TenantService tenantService;

    private BaseDatabase doCreate(DatabaseType databaseType) {
        if ( databaseType == DatabaseType.POSTGRES ) {
            return new Postgres();
        }
        else if ( databaseType == DatabaseType.TIMESCALE ) {
            return new Postgres();
        }
        else if ( databaseType == DatabaseType.DUCKDB ) {
            return new DuckDb(tenantService.getTenant());
        }
        else if ( databaseType == DatabaseType.MYSQL ) {
            return new MySql();
        }
        else if ( databaseType == DatabaseType.SINGLESTORE ) {
            return new SingleStore();
        }
        else if ( databaseType == DatabaseType.SNOWFLAKE ) {
         return new Snowflake();
        }
        
        throw new IllegalArgumentException("Couldnt get database for " + databaseType);
    }

    public Database create (DatabaseType databaseType, Boolean quoteIdentifiers) {
        var database = doCreate(databaseType);
        database.setQuoteIdentifiers(quoteIdentifiers);
        return database;
    }
}
