package hopara.dataset.database;

import hopara.dataset.datasource.DataSource;

public class MySql extends MySqlClass {

    @Override
    public String getJdbcUrl(DataSource dataSource) {
        return "jdbc:mysql://" + getServerPort(dataSource) + "/" + dataSource.getDatabase();
    }

    @Override
    public String getDriverClass() {
        return "com.mysql.cj.jdbc.Driver";
    }
    
    @Override
    public DatabaseType getType() {
        return DatabaseType.MYSQL;
    }
}
