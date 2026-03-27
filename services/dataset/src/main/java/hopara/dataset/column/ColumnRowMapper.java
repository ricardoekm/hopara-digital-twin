package hopara.dataset.column;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

@Component
public class ColumnRowMapper implements RowMapper<Column> {

	@Autowired
	ColumnFactory columnFactory;

	@Override
	public Column mapRow(ResultSet rs, int rowNum) throws SQLException {		
		var column = columnFactory.create();
        column.setName(rs.getString("column_name"));
        column.setType(ColumnType.valueOf(rs.getString("column_type")));
		return column;
	}

}
