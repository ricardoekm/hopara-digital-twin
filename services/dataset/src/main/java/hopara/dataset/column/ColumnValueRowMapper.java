package hopara.dataset.column;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

@Component
public class ColumnValueRowMapper implements RowMapper<Object> {

    @Override
    public Object mapRow(ResultSet rs, int rowNum) throws SQLException {
        return rs.getObject("columnValue");
    }
    
}
