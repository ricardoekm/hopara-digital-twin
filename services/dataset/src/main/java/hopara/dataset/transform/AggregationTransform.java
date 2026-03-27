package hopara.dataset.transform;

import java.util.ArrayList;

import hopara.dataset.column.Column;
import hopara.dataset.column.Columns;

public abstract class AggregationTransform extends QueryProcessingTransform {
    private String getAggregationSelect(Column column) {
        var select = "avg($sql_name) AS avg_$name, max($sql_name) AS max_$name, min($sql_name) AS min_$name, sum($sql_name) AS sum_$name";
        select = select.replace("$name", column.getName());
        return select.replace("$sql_name", column.getSqlName());
    }

    protected String getAggregationSelects(Columns columns) {
        var selects = new ArrayList<String>();
        
        if ( columns.getQuantitative().size() == 0 ) {
            return "";
        }

        for ( var column : columns.getQuantitative() ) {
            selects.add(getAggregationSelect(column));
        }

        return ", " + String.join(", ", selects);
    }

    protected Columns getAggregationColumns(Columns columns) {
        var aggregationColumns = new Columns();
        for ( var column : columns.getQuantitative() ) {
            aggregationColumns.add(new Column("avg_" + column.getName(), column.getType()));
            aggregationColumns.add(new Column("max_" + column.getName(), column.getType()));
            aggregationColumns.add(new Column("min_" + column.getName(), column.getType()));
            aggregationColumns.add(new Column("sum_" + column.getName(), column.getType()));
        }

        return aggregationColumns;
    }
}
