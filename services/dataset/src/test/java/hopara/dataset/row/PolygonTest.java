package hopara.dataset.row;

import static org.junit.jupiter.api.Assertions.assertEquals;
import java.util.List;

import org.junit.jupiter.api.Test;
import static hopara.dataset.test.Assert.assertNumberEquals;

public class PolygonTest {
    private void assertCoordinateEquals(Number longitude, Number latitude, List<Number> list) {
        assertNumberEquals(longitude, list.get(0));
        assertNumberEquals(latitude, list.get(1));
    }

    @Test
    public void split_polygon() {
        var polygon = new Geometry();
        polygon.add(-180,90);
        polygon.add(180,90);
        polygon.closeRing();

        var splitPolygon = polygon.split();

        assertEquals(2, splitPolygon.size());

        assertCoordinateEquals(-180,90,splitPolygon.get(0).get(0));
        assertCoordinateEquals(0,90,splitPolygon.get(0).get(1));

        assertCoordinateEquals(0,90,splitPolygon.get(1).get(0));
        assertCoordinateEquals(180,90,splitPolygon.get(1).get(1));
    }

    @Test
    public void split_inverted_polygon() {
        var polygon = new Geometry();
        polygon.add(180,90);
        polygon.add(-180,90);
        polygon.closeRing();

        var splitPolygon = polygon.split();
        assertEquals(2, splitPolygon.size());

        assertCoordinateEquals(-180,90,splitPolygon.get(0).get(0));
        assertCoordinateEquals(0,90,splitPolygon.get(0).get(1));

        assertCoordinateEquals(0,90,splitPolygon.get(1).get(0));
        assertCoordinateEquals(180,90,splitPolygon.get(1).get(1));
    }
}
