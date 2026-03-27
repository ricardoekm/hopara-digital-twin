package hopara.dataset.stats.column;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import hopara.dataset.database.Database;
import hopara.dataset.row.converter.ArrayConverter;

@Component
public class ColumnStatsRowMapper implements RowMapper<ColumnStats>{

    @Autowired
    ArrayConverter arrayConverter;

    Database database;
    
    public ColumnStatsRowMapper() { }
    
    private Double getNullableDouble(ResultSet rs, String column) throws SQLException {
        return Optional.ofNullable(rs.getBigDecimal(column))
                       .map(BigDecimal::doubleValue).orElse(null);
    }

    private ColumnStats createTwoDimensionStats(ResultSet rs) throws SQLException {
        var columnStats = new ColumnStats(rs.getString("column_name"), 
                                          getNullableDouble(rs,"column_min_x"), 
                                          getNullableDouble(rs,"column_max_x"));
        columnStats.setMinY(getNullableDouble(rs, "column_min_y"));
        columnStats.setMaxY(getNullableDouble(rs,"column_max_y"));
        return columnStats;
    }
    
    @SuppressWarnings({ "unchecked", "rawtypes" })
    private Set removeNullValues(Set set) {
        set.removeAll(Collections.singleton(null));
        return set;
    }

    @SuppressWarnings({ "unchecked", "rawtypes" })
    private Set<BigDecimal> getPercentiles(ResultSet rs) throws SQLException {
        var pencentilesList = (List)arrayConverter.fromDatabaseFormat(rs.getObject("column_percentiles"));
        if ( pencentilesList != null ) {
            var percentilesSet = new LinkedHashSet(pencentilesList);             
            return removeNullValues(percentilesSet);  
        }

        return null;
    }

    @SuppressWarnings({ "unchecked", "rawtypes" })
    private Set<String> getValues(ResultSet rs) throws SQLException {
        var valuesList = (List)arrayConverter.fromDatabaseFormat(rs.getObject("column_top_values"));
        if ( valuesList != null ) {
            var valuesSet = new LinkedHashSet(valuesList);             
            return removeNullValues(valuesSet);  
        }

        return null;
    }

    private ColumnStats createOneDimensionStats(ResultSet rs) throws SQLException {
        var columnStats = new ColumnStats(rs.getString("column_name"), 
                                          getNullableDouble(rs,"column_min_x"), 
                                          getNullableDouble(rs,"column_max_x")); 
        columnStats.setPercentiles(getPercentiles(rs));
        columnStats.setValues(getValues(rs));

        return columnStats;
    }

    private Boolean isOneDimension(ResultSet rs) throws SQLException {
        return rs.getBoolean("column_one_dimension");
    }
    
	@Override
	public ColumnStats mapRow(ResultSet rs, int rowNum) throws SQLException {
	    if ( isOneDimension(rs) ) {
	        return createOneDimensionStats(rs);
	    }
	    else {
	        return createTwoDimensionStats(rs);
	    }
	}
}
