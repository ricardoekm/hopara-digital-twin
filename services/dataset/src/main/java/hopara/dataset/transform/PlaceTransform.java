package hopara.dataset.transform;

import hopara.dataset.column.Columns;

public class PlaceTransform extends Transform {

    @Override
    public TransformType getType() {
        return TransformType.PLACE;
    }

    @Override
    public Columns getColumns(Columns viewColumns) {
        return viewColumns;
    }
}
