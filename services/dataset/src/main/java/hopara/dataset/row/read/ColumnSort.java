package hopara.dataset.row.read;

import hopara.dataset.SqlSanitizer;
import hopara.dataset.database.Database;

public class ColumnSort implements Sort{
    String column;
    SortOrder order;

    public ColumnSort(String column, SortOrder order) {
        this.column = column;
        this.order = order; 
    }
    
    public String getColumn() {
        return column;
    }
    public void setColumn(String field) {
        this.column = field;
    }
    
    public SortOrder getOrder() {
        return order;
    }
    public void setOrder(SortOrder order) {
        this.order = order;
    }

    public String getClause(Database database) {
        return SqlSanitizer.cleanString(column) + " " + order;
    }
}
