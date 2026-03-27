package hopara.dataset.stats;

import java.math.BigDecimal;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import hopara.dataset.column.Column;
import hopara.dataset.column.Columns;
import hopara.dataset.database.Database;
import hopara.dataset.database.DatabaseClass;
import hopara.dataset.stats.column.ColumnStatsFactory;

public class StatsGenerator {
    
    @Autowired
    protected Database database;

    @Value("${percentilStep:0.125}")
    private BigDecimal percentilStep;

    public void setPercentilStep(BigDecimal percentilStep) {
        this.percentilStep = percentilStep;
    }
    
    protected String format(String format, Object... args) {
        return String.format(java.util.Locale.US,format, args);
    }
    
    private ArrayList<String> getPercentileSelects(String name) {
        var percentile = new BigDecimal("0");
        
        var lastPercentil = new BigDecimal("1");
        var beforeLast = lastPercentil.subtract(percentilStep);
        
        var selects = new ArrayList<String>();
        while(percentile.compareTo(beforeLast) <= 0) {
            selects.add(format("percentile_disc(%f) within group (order by %s asc)\n", percentile, name));
            percentile = percentile.add(percentilStep);
        }
        
        // The leftover goes to the final percentil (e.g. split into 9, 0.88 to 1.0 goes to the last)
        selects.add(format("percentile_disc(%f) within group (order by %s asc)", lastPercentil, name));
        return selects;
    }
    
    protected String getPercentileSelect(String name) {   
        if ( database.isClass(DatabaseClass.MYSQL) ) {
            String percentileSelect = "CONCAT('[',";                    
            percentileSelect += String.join(",',',", getPercentileSelects(name)) + ",']') AS $name_percentiles";     
            return percentileSelect;
        }
        
        String percentileSelect = "ARRAY [";                    
        percentileSelect += String.join(",", getPercentileSelects(name)) + "] AS $name_percentiles";     
        return percentileSelect;
    }
    
    private String getDateSelect(String tableName, Column column) {
        var columnAsEpoch = "EXTRACT(EPOCH from " + column.getSqlName() + ")::BIGINT * 1000";
        
        if ( database.isClass(DatabaseClass.MYSQL) ) {
            columnAsEpoch = "UNIX_TIMESTAMP(" + column.getSqlName() + ") * 1000";
        }
        
        return format("min(%s) as $name_min_x, max(%s) as $name_max_x, %s", 
                      columnAsEpoch, columnAsEpoch, getPercentileSelect(columnAsEpoch));
    }

    private String getNumericSelect(String tableName, Column column) {
        return format("min(%s) as $name_min_x, max(%s) as $name_max_x, %s", 
                      column.getSqlName(), column.getSqlName(),  
                      getPercentileSelect(column.getSqlName()));
    }
        
    private String getQueryByType(String tableName, Column column) {
        if ( column.isTemporal() ) {
            return getDateSelect(tableName, column);   
        }
        else {
            return getNumericSelect(tableName, column);
        }
    }

    protected String getQuery(String tableName, Columns columns) {
        String query = "";
        for ( var column : columns ) {
            if ( ColumnStatsFactory.shouldCreateStats(column, database) ) {
                if ( query.isEmpty() ) {
                    query += "SELECT ";
                }
                else {
                    query += ",\n";
                }
                
                var columnSelect = getQueryByType(tableName, column).replace("$name",column.getName());
                query += columnSelect;
            }
        }
        
        query += "\nFROM " + tableName;
        return query;
    }

    protected String getStringQuery(String tableName, Column column) {
        var valuesLimit = 20;
        var innerQuery = format("SELECT LEFT(%s,32) as value " +
                                "FROM %s " +
                                "WHERE %s IS NOT NULL " +
                                "GROUP BY %s " +
                                "ORDER BY count(*) DESC " +
                                "LIMIT %d ",
                                column.getSqlName(), 
                                tableName,
                                column.getSqlName(), 
                                column.getSqlName(), 
                                valuesLimit);

                            
        var outerQuery = format("SELECT '%s' as name, array_agg(value) as top_values FROM  (%s) AS %s",
                                column.getOriginalName(),
                                innerQuery,
                                tableName + column.getName());
                  
                                

        return outerQuery;
    }

    public boolean hasQuantitativeStats(Columns columns) {        
        for ( var column : columns ) {
            if ( ColumnStatsFactory.shouldCreateStats(column, database) ) {
                return true;
            }
        }

        return false;
    }
}
