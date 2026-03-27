package hopara.dataset.stats.column;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;

import hopara.dataset.column.Column;
import hopara.dataset.column.ColumnType;
import hopara.dataset.database.Database;

public class ColumnStatsFactory {
    
    public static Double getNullableDouble(ResultSet rs, String column) throws SQLException {
        return Optional.ofNullable(rs.getBigDecimal(column))
                       .map(BigDecimal::doubleValue).orElse(null);
    }


    public static ColumnStats fromResultSet(Column column, ResultSet rs) throws SQLException {
        return new ColumnStats(column.getName(), 
                               getNullableDouble(rs,column.getName() + "_min_x"), 
                               getNullableDouble(rs, column.getName() + "_max_x")); 

    }

    public static Boolean shouldCreateStats(Column column, Database database) {
        return column.isQuantitative() && !column.isType(ColumnType.AUTO_INCREMENT) && !column.getPrimaryKey();
    }
}
