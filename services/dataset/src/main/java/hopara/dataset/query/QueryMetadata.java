package hopara.dataset.query;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonGetter;

import hopara.dataset.column.Columns;

public class QueryMetadata {
    Columns columns = new Columns();
    List<String> tableNames = new ArrayList<String>();
    
    public void setColumns(Columns columns) {
        this.columns = columns;
    }

    public Columns getColumns() {
        return columns;
    }

    public void addTableName(String tableName) {
        this.tableNames.add(tableName);
    }

    @JsonGetter("tables")
    public List<String> getTableNames() {
        return tableNames;
    }
}
