package hopara.dataset.transform;

import hopara.dataset.column.Column;
import hopara.dataset.column.ColumnType;
import hopara.dataset.column.Columns;

public class NeighborCountTransform extends Transform {
    @Override
    public TransformType getType() {
        return TransformType.NEIGHBOR_COUNT;
    }

    @Override
    public Columns getColumns(Columns viewColumns) {
        var columns = new Columns();
        columns.addAll(viewColumns);
        columns.add(new Column("neighbor_count", ColumnType.INTEGER));
        columns.add(new Column("has_neighbors", ColumnType.BOOLEAN));
        return columns;
    }
}
