package hopara.dataset.transform;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

import hopara.dataset.column.Column;
import hopara.dataset.column.ColumnType;
import hopara.dataset.database.DatabaseClass;
import hopara.dataset.view.View;

public class RoomClusterTransformTest {
    @Test
    public void transform() {
        var queryText = "SELECT type, room, utilization FROM assets";
        var view = new View("hopara","assets",queryText, DatabaseClass.POSTGRES);
        view.addColumn(new Column("type", ColumnType.STRING));
        view.addColumn(new Column("room", ColumnType.GEOMETRY));
        view.addColumn(new Column("utilization", ColumnType.DECIMAL));

        var roomClusterTransform = new RoomClusterTransform();
        roomClusterTransform.setGroupColumn("type");
        roomClusterTransform.setRoomGeometryColumn("room");

        var expectedTransformQuery = "SELECT room as room_coordinates, ST_Transform(ST_OrientedEnvelope(ST_Transform(ST_SetSrid(room,4326),3857)),4326) as room_bounding_box, ST_GeoHash(room, 15) as _room_id, type as item_group, 'no-floor' as floor, count(*) AS item_count, " +
                                    "(row_number() OVER (PARTITION BY ST_GeoHash(room, 15) ORDER BY count(*) DESC) - 1) AS _index_in_room, " +
                                     "avg(utilization) AS avg_utilization, " +
                                     "max(utilization) AS max_utilization, min(utilization) AS min_utilization, " +
                                     "sum(utilization) AS sum_utilization " +
                                     "FROM assets_query " +
                                     "GROUP BY 1, 2, 3, 4, 5";

        var transformQuery = roomClusterTransform.getQuery(view.getColumns(),"assets_query");
        assertEquals(expectedTransformQuery,transformQuery);
    }
}
