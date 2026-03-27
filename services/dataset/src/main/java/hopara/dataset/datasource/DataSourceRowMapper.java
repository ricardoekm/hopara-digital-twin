package hopara.dataset.datasource;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;

import org.springframework.jdbc.core.RowMapper;

import hopara.dataset.database.DatabaseType;

public class DataSourceRowMapper implements RowMapper<DataSource> {

    public static Integer getNullableInteger(ResultSet rs, String column) throws SQLException {
        return Optional.ofNullable(rs.getBigDecimal(column))
                       .map(BigDecimal::intValue).orElse(null);
    }

    @Override
    public DataSource mapRow(ResultSet rs, int rowNum) throws SQLException {
        var dataSource = new DataSource();
        dataSource.setName(rs.getString("name"));
        dataSource.setUsername(rs.getString("username"));
        dataSource.setDatabase(rs.getString("database"));
        dataSource.setHost(rs.getString("server"));
        dataSource.setPort(getNullableInteger(rs, "port"));
        dataSource.setSchema(rs.getString("schema"));
        dataSource.setMaxConnections(getNullableInteger(rs,"max_connections"));
        dataSource.setType(DatabaseType.valueOf(rs.getString("type"))); 
        dataSource.setQuoteIdentifiers(rs.getBoolean("quote_identifiers"));  
        dataSource.setAnnotation(rs.getString("annotation"));     
        return dataSource;
    }

}
