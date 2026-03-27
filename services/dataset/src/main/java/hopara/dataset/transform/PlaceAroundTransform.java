package hopara.dataset.transform;

import hopara.dataset.column.Columns;

public class PlaceAroundTransform extends Transform {

    @Override
    public TransformType getType() {
        return TransformType.PLACE_AROUND;
    }

    @Override
    public Columns getColumns(Columns viewColumns) {
        return viewColumns;
    }
}
