package hopara.dataset.position;

import hopara.dataset.column.ColumnType;
import hopara.dataset.table.Table;
import hopara.dataset.column.Column;

public class PositionHistoryTable extends Table {
    public PositionHistoryTable(Table positionTable) {
        super(positionTable.getDataSourceName(), positionTable.getName() + "_hist");
        addColumns(positionTable.getColumns());
        addColumn(new Column(PositionHistoryColumns.CREATED_AT_COLUMN_NAME, ColumnType.DATETIME, true));
    }
}
