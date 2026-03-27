package hopara.dataset.entitytable;

import hopara.dataset.column.Column;
import hopara.dataset.column.ColumnType;
import hopara.dataset.column.Columns;
import hopara.dataset.datasource.DataSource;
import hopara.dataset.table.Table;

public class EntityTable extends Table {
    public static String ID_COLUMN = "id";
    public static String NAME_COLUMN = "name";

    public static Column getIdColumn() {
        return new Column(ID_COLUMN, ColumnType.AUTO_INCREMENT);
    }

    private Columns getEntityColumns() {
        var columns = new Columns();
        columns.add(getIdColumn());
        columns.add(new Column(NAME_COLUMN, ColumnType.STRING));
        columns.add(new Column("hopara_scope", ColumnType.STRING));
        columns.add(new Column("tenantId", ColumnType.STRING));
        return columns;
    }

    public EntityTable(String tableName) {
        super(DataSource.DEFAULT_NAME, tableName);
        addColumns(getEntityColumns());
    }

    
}
