package hopara.dataset.transform;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import hopara.dataset.column.Column;
import hopara.dataset.column.ColumnType;
import hopara.dataset.database.DatabaseClass;
import hopara.dataset.row.Geometry;
import hopara.dataset.row.RowIntegrationTest;
import hopara.dataset.table.Table;
import hopara.dataset.view.View;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static hopara.dataset.test.Assert.assertNumberEquals;


public class RoomClusterIntegrationTest extends RowIntegrationTest {
    @Override
    protected Table getTable() {
        var table = new Table("hopara","assets");
        table.addColumn(new Column("type", ColumnType.STRING));
        table.addColumn(new Column("room_geometry", ColumnType.GEOMETRY));
        table.addColumn(new Column("room_name", ColumnType.STRING));
        return table;
    }

    @Override
    protected View getView() {
        var queryText = "SELECT type, room_geometry, room_name FROM assets";
        var view = new View("hopara","assets",queryText, DatabaseClass.POSTGRES);
        return view;
    }

    private Map<String,Object> getValues(String type, String roomName, Geometry roomPolygon) {
        var values = new HashMap<String,Object>();
        values.put("type", type);
        values.put("room_name", roomName);
        values.put("room_geometry", roomPolygon);
        return values;
    }

    @BeforeEach
    public void setUp() {
        var room1 = new Geometry();
        room1.add(0, 0);
        room1.add(1, 0);
        room1.add(1, 1);
        room1.add(0, 1);
        room1.closeRing();

        saveRow(getValues("refrigerator", "room1", room1 ));
        saveRow(getValues("refrigerator", "room1", room1));

        var room2 = new Geometry();
        room2.add(1, 1);
        room2.add(2, 1);
        room2.add(2, 2);
        room2.add(1, 2);
        room2.closeRing();

        saveRow(getValues("refrigerator", "room2", room2));
        saveRow(getValues("incubator", "room2", room2));
    }

    @Test
    public void room_cluster() {
        var transform = new RoomClusterTransform("room_geometry",  "type");
        var rows = findRows(transform);
        assertEquals(3, rows.size());

        assertEquals("refrigerator", rows.get(0).get("item_group"));
        assertEquals("s006g7h0dyg00tw", rows.get(0).get("_room_id"));
        assertNumberEquals(2, rows.get(0).get("item_count"));
        assertNumberEquals(0, rows.get(0).get("_index_in_room"));

        assertEquals("refrigerator", rows.get(2).get("item_group"));
        assertEquals("s030d1h60s30d1h", rows.get(2).get("_room_id"));
        assertNumberEquals(1, rows.get(2).get("item_count"));
        assertNumberEquals(1, rows.get(2).get("_index_in_room"));

        assertEquals("incubator", rows.get(1).get("item_group"));
        assertEquals("s030d1h60s30d1h", rows.get(1).get("_room_id"));
        assertNumberEquals(1, rows.get(1).get("item_count"));
        assertNumberEquals(0, rows.get(1).get("_index_in_room"));
    }
}