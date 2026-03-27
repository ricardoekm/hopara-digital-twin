package hopara.dataset.stats;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.springframework.jdbc.core.RowMapper;

import hopara.dataset.column.Column;
import hopara.dataset.column.ColumnType;
import hopara.dataset.column.Columns;
import hopara.dataset.database.Database;
import hopara.dataset.stats.column.ColumnStats;
import hopara.dataset.stats.column.ColumnStatsFactory;
import hopara.dataset.stats.column.ColumnStatsList;

public class QuantitativeStatsRowMapper implements RowMapper<ColumnStatsList>{

    Database database;
    Columns columns;
    
    public QuantitativeStatsRowMapper() { }

    public QuantitativeStatsRowMapper(Database database, Columns columns) {
        this.database = database;
        this.columns = columns;
    }
    
    private ColumnStats createTwoDimensionStats(Column column, ResultSet rs) throws SQLException {
        var columnStats = ColumnStatsFactory.fromResultSet(column, rs);
        columnStats.setMinY(ColumnStatsFactory.getNullableDouble(rs, column.getName() + "_min_y"));
        columnStats.setMaxY(ColumnStatsFactory.getNullableDouble(rs, column.getName() + "_max_y"));
        return columnStats;
    }
    
    @SuppressWarnings({ "unchecked", "rawtypes" })
    private Set removeNullValues(Set set) {
        set.removeAll(Collections.singleton(null));
        return set;
    }

    @SuppressWarnings({ "unchecked", "rawtypes" })
    private Set<BigDecimal> getPercentiles(Column column, ResultSet rs) throws SQLException {
        var rawPercentiles = rs.getObject(column.getName() + "_percentiles");
        var pencentilesList = (List)database.getArrayConverter().fromDatabaseFormat(rawPercentiles);
        if ( pencentilesList != null ) {
            var percentilesSet = new LinkedHashSet(pencentilesList);             
            return removeNullValues(percentilesSet);  
        }

        return null;
    }

    private ColumnStats createOneDimensionStats(Column column, ResultSet rs) throws SQLException {
        var columnStats = ColumnStatsFactory.fromResultSet(column, rs);
        columnStats.setPercentiles(getPercentiles(column, rs));
        return columnStats;
    }
    
    private ColumnStats createStats(Column column, ResultSet rs) throws SQLException {
        if ( column.isType(ColumnType.GEOMETRY)) {
            return createTwoDimensionStats(column, rs);
        }
        else {
            return createOneDimensionStats(column, rs);
        }
    }

	@Override
	public ColumnStatsList mapRow(ResultSet rs, int rowNum) throws SQLException {
        var columnStatsList = new ColumnStatsList();
        for ( var column : columns ) {  
            if ( ColumnStatsFactory.shouldCreateStats(column, database) ) {
                columnStatsList.add(createStats(column, rs));
            }
        }

        return columnStatsList;
	}
}
