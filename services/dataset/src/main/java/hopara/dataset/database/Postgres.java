package hopara.dataset.database;

import hopara.dataset.datasource.DataSource;

public class Postgres extends PostgresClass {
    @Override
    public String getJdbcUrl(DataSource dataSource) {
        if ( dataSource.hasSchema() ) {
            return "jdbc:postgresql://"+ getServerPort(dataSource) + "/" + dataSource.getDatabase() + "?currentSchema=" + dataSource.getSchema() + "&stringtype=unspecified";
        }
        else { 
            return "jdbc:postgresql://"+ getServerPort(dataSource) + "/" + dataSource.getDatabase() + "?stringtype=unspecified";
        }
    }

    @Override
    public String getTestJdbcUrl(DataSource dataSource) {
        return getJdbcUrl(dataSource) + "&connectTimeout=2";
    }

    @Override
    public String getDriverClass() {
        return "org.postgresql.Driver";
    }

    @Override
    public DatabaseType getType() {
        return DatabaseType.POSTGRES;
    }
}
