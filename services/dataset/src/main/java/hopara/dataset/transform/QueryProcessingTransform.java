package hopara.dataset.transform;

import hopara.dataset.column.Columns;

public abstract class QueryProcessingTransform extends Transform {
    public abstract String getQuery(Columns viewColumns, String baseCteName);
}
