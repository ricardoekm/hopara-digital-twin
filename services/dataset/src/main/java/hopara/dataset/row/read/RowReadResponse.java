package hopara.dataset.row.read;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import hopara.dataset.column.Columns;
import hopara.dataset.stats.column.ColumnStatsList;

@SuppressWarnings("rawtypes")
public class RowReadResponse {

    @JsonInclude(Include.ALWAYS)
    private List rows;
    private Columns columns;

    public void setRows(List rows) {
        this.rows = rows;
    }

    public List getRows() {
        return rows;
    }

    public void setColumns(Columns columns) {
        this.columns = columns;
    }

    public Columns getColumns() {
        return columns;
    }

    public void limitRows(Integer limit) {
        this.rows = this.rows.subList(0, limit);

    }

    public void fillStats(ColumnStatsList stats) {
        for ( var column : getColumns() ) {
            column.setStats(stats.get(column.getName()));
        }
    }
}
