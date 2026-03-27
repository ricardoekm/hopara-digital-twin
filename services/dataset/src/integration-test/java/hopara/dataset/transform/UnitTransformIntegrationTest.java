package hopara.dataset.transform;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.Test;

import hopara.dataset.column.Column;
import hopara.dataset.column.ColumnType;
import hopara.dataset.database.DatabaseClass;
import hopara.dataset.row.RowIntegrationTest;
import hopara.dataset.table.Table;
import hopara.dataset.view.View;
import static hopara.dataset.test.Assert.assertNumberEquals;

public class UnitTransformIntegrationTest extends RowIntegrationTest {
    @Override
    protected Table getTable() {
        var table = new Table("hopara","my_assets");
        table.addColumn(new Column("type", ColumnType.STRING));
        table.addColumn(new Column("risk", ColumnType.DECIMAL));
        return table;
    }

    @Override
    protected View getView() {
        var queryText = "SELECT type, risk FROM my_assets";
        var view = new View("hopara","assets",queryText, DatabaseClass.POSTGRES);
        return view;
    }

    private Map<String,Object> getValues(String type, double risk) {
        var values = new HashMap<String,Object>();
        values.put("type", type);
        values.put("risk", risk);
        return values;
    }

    @Test
    public void unit_transform() {
        saveRow(getValues("refrigerator", 0.2));
        saveRow(getValues("refrigerator", 0.1));
        saveRow(getValues("centrifuge", 0.3));

        var transform = new UnitTransform();
        transform.setGroupColumn("type");

        var rows = findRows(transform);
        assertEquals("refrigerator", rows.get(0).get("type"));
        assertNumberEquals(2, rows.get(0).get("count"));

        assertEquals("refrigerator", rows.get(1).get("type"));
        assertNumberEquals(2, rows.get(1).get("count"));

        assertEquals("centrifuge", rows.get(2).get("type"));
        assertNumberEquals(1, rows.get(2).get("count"));
    }    

    @Test
    public void sort() {
        saveRow(getValues("refrigerator", 0.2));
        saveRow(getValues("refrigerator", 0.1));
        saveRow(getValues("refrigerator", 0.3));

        var transform = new UnitTransform();
        transform.setGroupColumn("type");
        transform.setSortColumn("risk");

        var rows = findRows(transform);
        assertNumberEquals(0, rows.get(0).get("_index"));
        assertNumberEquals(0.1, rows.get(0).get("risk"));
        
        assertNumberEquals(1, rows.get(1).get("_index"));
        assertNumberEquals(0.2, rows.get(1).get("risk"));

        assertNumberEquals(2, rows.get(2).get("_index"));
        assertNumberEquals(0.3, rows.get(2).get("risk"));
    }

    @Test
    public void groupLimit() {
        saveRow(getValues("refrigerator", 0.2));
        saveRow(getValues("centrifuge", 0.3));

        var transform = new UnitTransform();
        transform.setGroupColumn("type");
        transform.setGroupLimit(1);

        var rows = findRows(transform);
        assertEquals(1, rows.size());
    }
}
