package hopara.dataset.transform;

import hopara.dataset.column.Column;
import hopara.dataset.column.ColumnType;
import hopara.dataset.column.Columns;

public class GroupByTransform extends Transform {

    @Override
    public TransformType getType() {
        return TransformType.GROUP_BY;
    }

    @Override
    public Columns getColumns(Columns viewColumns) {
        var columns = new Columns();
        for ( var column : viewColumns ) {
            if ( column.isQuantitative() || column.isType(ColumnType.BOOLEAN) ) {
                columns.add(new Column("max_" + column.getName(), column.getType()));
            }
            
            // we'll assume that the user can aggregate by any column
            // because we don't have dynamic typing
            columns.add(column);
        }

        return columns;
    }
    
}
