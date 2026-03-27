package hopara.dataset.stats;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.springframework.jdbc.core.RowMapper;
import hopara.dataset.database.Database;
import hopara.dataset.stats.column.ColumnStats;

public class StringStatsRowMapper implements RowMapper<ColumnStats>{

    Database database;
    
    public StringStatsRowMapper() { }

    public StringStatsRowMapper(Database database) {
        this.database = database;
    }

    @SuppressWarnings({ "unchecked", "rawtypes" })
    private Set removeNullValues(Set set) {
        set.removeAll(Collections.singleton(null));
        return set;
    }

    @SuppressWarnings({ "unchecked", "rawtypes" })
    private Set<String> getValues(ResultSet rs) throws SQLException {
        var valuesList = (List)database.getArrayConverter().fromDatabaseFormat(rs.getObject("top_values"));
        if ( valuesList != null ) {
            var valuesSet = new LinkedHashSet(valuesList);             
            return removeNullValues(valuesSet);  
        }

        return new HashSet<String>();
    }

	@Override
	public ColumnStats mapRow(ResultSet rs, int rowNum) throws SQLException {
        var columnStats = new ColumnStats(rs.getString("name"));
        columnStats.setValues(getValues(rs));
        return columnStats;
	}
}
