package hopara.dataset.transform;

import hopara.dataset.column.Columns;

public class NullTransform extends Transform {

    @Override
    public TransformType getType() {
        return TransformType.NONE;
    }

    @Override
    public Columns getColumns(Columns viewColumns) {
        return new Columns();
    }
    
}
