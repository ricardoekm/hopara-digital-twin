package hopara.dataset.stats.row;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.HashMap;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import hopara.dataset.filter.Operator;
import hopara.dataset.filter.Filter;
import hopara.dataset.filter.Filters;
import hopara.dataset.row.RowIntegrationTest;
import hopara.dataset.transform.UnitTransform;

public class RowStatsGeneratorTest extends RowIntegrationTest {
    @Autowired
    RowsStatsGenerator rowStatsGenerator;

    @Test
    public void test_generate_row_stats() {
        var galoValues = new HashMap<String, Object>();
        galoValues.put("nome", "Galo");
        galoValues.put("idade", 35);

        saveRow(galoValues);

        var bradValues = new HashMap<String, Object>();
        bradValues.put("nome", "Brad");
        bradValues.put("idade", 33);
        saveRow(bradValues);

        var camargoValues = new HashMap<String, Object>();
        camargoValues.put("nome", "Camargo");
        camargoValues.put("idade", 30);
        saveRow(camargoValues);

        var filters = new Filters();
        var filter = new Filter("idade", 30, Operator.GREATER_THAN);
        filters.add(filter);

        var stats = rowStatsGenerator.generateViewStats(getSavedView(), filters);
        var idadeStats = stats.get("idade");
        assertEquals(35d, idadeStats.getMax());
        assertEquals(33d, idadeStats.getMin());
    }

     @Test
    public void test_generate_row_stats_with_transform() {
        var galoValues = new HashMap<String, Object>();
        galoValues.put("nome", "Galo");
        galoValues.put("cidade", "Volta Redonda");
        saveRow(galoValues);

        var bradValues = new HashMap<String, Object>();
        bradValues.put("nome", "Brad");
        bradValues.put("cidade", "Nikiti");
        saveRow(bradValues);

        var camargoValues = new HashMap<String, Object>();
        camargoValues.put("nome", "Camargo");
        camargoValues.put("cidade", "Volta Redonda");
        saveRow(camargoValues);

        var transform = new UnitTransform();
        transform.setGroupColumn("cidade");

        var stats = rowStatsGenerator.generateTransformStats(getSavedView(), transform, new Filters());
        var countStats = stats.get("count");
        assertEquals(2, countStats.getMax());
        assertEquals(1, countStats.getMin());
    }
}
