package hopara.dataset.boundingbox;

import java.util.HashMap;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import hopara.dataset.filter.Filters;
import hopara.dataset.row.RowIntegrationTest;

import static hopara.dataset.test.Assert.assertNumberEquals;

public class BoundingBoxRepositoryTest extends RowIntegrationTest {
    @Autowired
    BoundingBoxRepository boundingBoxRepository;

    @Test
    public void get_bounding_box() {
        var galoRow = new HashMap<String,Object>();
		galoRow.put("idade", 30);
        galoRow.put("peso", 70.5);
		saveRow(galoRow);

		var bradRow = new HashMap<String,Object>();
		bradRow.put("idade", 60);
        bradRow.put("peso", 80.5);
		saveRow(bradRow);

        var spatialView = new SpatialView(getSavedView(), getSavedView().getAllColumns().get("idade"),
                                                          getSavedView().getAllColumns().get("peso"));

        var boundingBox = boundingBoxRepository.getBoundingBox(spatialView, new Filters());
        assertNumberEquals(30, boundingBox.getMinX());
        assertNumberEquals(60, boundingBox.getMaxX());
        assertNumberEquals(70.5, boundingBox.getMinY());
        assertNumberEquals(80.5, boundingBox.getMaxY());
    }
}
