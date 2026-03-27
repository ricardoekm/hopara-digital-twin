package hopara.dataset.query;

import java.util.List;
import java.util.Map;

import hopara.dataset.column.Columns;

public class QueryRunResult {
    Columns columns;
    List<Map<String,Object>> rows;

    public void setColumns(Columns columns) {
        this.columns = columns;
    }

    public Columns getColumns() {
        return columns;
    }

    public void setRows(List<Map<String,Object>>  rows) {
        this.rows = rows;
    }

    public List<Map<String,Object>> getRows() {
        return rows;
    }
}
