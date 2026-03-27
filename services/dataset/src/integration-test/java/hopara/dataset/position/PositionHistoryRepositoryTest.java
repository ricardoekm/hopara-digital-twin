package hopara.dataset.position;


import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;

import hopara.dataset.column.Column;
import hopara.dataset.column.ColumnType;
import hopara.dataset.datasource.DataSource;
import hopara.dataset.row.RowIntegrationTest;
import hopara.dataset.table.Table;
import hopara.dataset.view.View;

public class PositionHistoryRepositoryTest extends RowIntegrationTest {

    @Autowired
    PositionService positionService;

    @Autowired
    PositionHistoryRepository positionHistoryRepository;

    Table positionTable;

    @BeforeEach
    void setup() {
        var view = new View("myds", "my_view777");
        var column = new Column("id", ColumnType.INTEGER);
        view.addColumn(column);
        view.setPrimaryKeyName("id");
        view.setDatabaseClass(database.getDbClass());

        positionTable = new Table(DataSource.DEFAULT_NAME, view.getName() + "_myds_pos");
        positionTable.addColumn(new Column("id", ColumnType.STRING));
        positionTable.addColumn(new Column("tenantId", ColumnType.STRING));

        positionService.createPositionView(view);
    } 
}
