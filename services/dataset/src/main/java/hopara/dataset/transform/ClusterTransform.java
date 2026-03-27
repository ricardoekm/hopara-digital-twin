package hopara.dataset.transform;

import hopara.dataset.column.Column;
import hopara.dataset.column.ColumnType;
import hopara.dataset.column.Columns;
import hopara.dataset.position.PositionColumns;

public class ClusterTransform extends Transform {

    @Override
    public TransformType getType() {
        return TransformType.CLUSTER;
    }

    @Override
    public Columns getColumns(Columns viewColumns) {
        var columns = new Columns();
        for ( var column : viewColumns ) {
            if ( column.isQuantitative() || column.isType(ColumnType.GEOMETRY) || column.isType(ColumnType.BOOLEAN) || column.hasSameName(PositionColumns.FLOOR_COLUMN_NAME) ) {
                columns.add(column);
            }
        }

        columns.add(new Column("point_count", ColumnType.INTEGER));
        return columns;
    }
}
