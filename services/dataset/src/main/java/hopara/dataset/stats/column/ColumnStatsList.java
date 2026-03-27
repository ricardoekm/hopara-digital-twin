package hopara.dataset.stats.column;

import java.util.ArrayList;

public class ColumnStatsList extends ArrayList<ColumnStats> {
    
    /**
     * 
     */
    private static final long serialVersionUID = 1L;

    public ColumnStats get(String columnName) {
        for ( var columnStats : this ) {
            if ( columnStats.hasSameName(columnName) ) {
                return columnStats;
            }
        }
        
        return null;
    }
}
