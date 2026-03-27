package hopara.dataset.view;

import java.sql.ResultSet;
import java.sql.SQLException;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.util.StringUtils;

import hopara.dataset.column.ColumnRowMapper;
import hopara.dataset.stats.column.ColumnStatsRowMapper;

public class ViewColumnsMapper implements ResultSetExtractor<Views> {
	ViewRowMapper viewRowMapper;
	ColumnRowMapper columnRowMapper;
	ColumnStatsRowMapper columnStatsRowMapper;

	public ViewColumnsMapper() {}

	public ViewColumnsMapper(ViewRowMapper viewRowMapper, ColumnRowMapper columnRowMapper, 
							ColumnStatsRowMapper columnStatsRowMapper) {
		this.viewRowMapper = viewRowMapper;
		this.columnRowMapper = columnRowMapper;
		this.columnStatsRowMapper = columnStatsRowMapper;
	} 
	
	@Override
	public Views extractData(ResultSet rs) throws SQLException, DataAccessException {
		var views = new Views();
		Integer rowNum = 0;
		while(rs.next()) {
			var view = viewRowMapper.mapRow(rs, rowNum);
			if ( !views.contains(view.getKey())) {
				views.add(view);
			}
			
			// Columns are optional in views
			if (StringUtils.hasText(rs.getString("column_name"))) {
	            var column = columnRowMapper.mapRow(rs, rowNum);
				var stats = columnStatsRowMapper.mapRow(rs, rowNum);
				column.setStats(stats);
	            views.get(view.getKey()).addColumn(column);   
			}
			
			rowNum++;
		}
		return views;
	}

}
