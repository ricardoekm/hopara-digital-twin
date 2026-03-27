package hopara.dataset.query;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.HashMap;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import hopara.dataset.column.Column;
import hopara.dataset.column.ColumnType;
import hopara.dataset.row.RowIntegrationTest;
import hopara.dataset.table.Table;
import hopara.dataset.view.View;

public class QueryServiceTest extends RowIntegrationTest {

    @Autowired
    QueryService queryService;

    @Override
    protected Table getTable() {
        var table = new Table("hopara","test_clientes");
        table.addColumn(new Column("nome", ColumnType.STRING));
        table.addColumn(new Column("idade", ColumnType.INTEGER));
        return table;
    }

    @Override
    protected View getView() {
        return null;
    }

    @Test
    void run_query() {
        var galoValues = new HashMap<String, Object>();
        galoValues.put("nome", "Galo");
        galoValues.put("idade", 36);

        saveRow(galoValues);

        var result = queryService.run("hopara", "SELECT * FROM test_clientes");
        var columns = result.getColumns();
        assertEquals(2, columns.size());
        assertEquals("nome", columns.get(0).getName());
        assertEquals(ColumnType.STRING, columns.get(0).getType());

        assertEquals("idade", columns.get(1).getName());
        assertEquals(ColumnType.INTEGER, columns.get(1).getType());

        var rows = result.getRows();
        assertEquals(1, rows.size());
        assertEquals("Galo", rows.get(0).get("nome"));
        assertEquals(36, rows.get(0).get("idade"));
    }
}
