package hopara.dataset.database;

import com.fasterxml.jackson.databind.ObjectMapper;

import hopara.dataset.datasource.DataSource;
import hopara.dataset.row.converter.ArrayConverter;
import hopara.dataset.row.converter.StringConverter;
import hopara.dataset.row.converter.singlestore.SingleStoreArrayConverter;
import hopara.dataset.row.converter.singlestore.SingleStoreStringConverter;

public class SingleStore extends MySqlClass {

    @Override
    public String getJdbcUrl(DataSource dataSource) {
        return "jdbc:singlestore://" + getServerPort(dataSource) + "/" + dataSource.getDatabase() + "?connectionAttributes=program_name:Hopara_AgileDigitalTwin";
    }

    @Override
    public String getDriverClass() {
        return "com.singlestore.jdbc.Driver";
    }

    @Override
    public DatabaseType getType() {
        return DatabaseType.SINGLESTORE;
    }

    @Override
    public StringConverter getStringConverter() {
        return new SingleStoreStringConverter();
    }

    @Override
    public ArrayConverter getArrayConverter() {
        return new SingleStoreArrayConverter(new ObjectMapper());
    }
}
