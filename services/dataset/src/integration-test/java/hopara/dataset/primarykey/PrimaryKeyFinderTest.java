package hopara.dataset.primarykey;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.HashMap;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import hopara.dataset.row.RowIntegrationTest;

public class PrimaryKeyFinderTest extends RowIntegrationTest {
 
    @Autowired
    PrimaryKeyFinder primaryKeyFinder;

    @Test
    void find() {
        var galoValues = new HashMap<String, Object>();
        galoValues.put("nome", "Galo");
        saveRow(galoValues);

        var camagoValues = new HashMap<String, Object>();
        camagoValues.put("nome", "Camago");
        saveRow(camagoValues);

        var column = primaryKeyFinder.find(getSavedView());
        assertEquals("_id", column.getName());
    }
}
