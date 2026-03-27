package hopara.dataset.row;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static hopara.dataset.test.Assert.assertNumberEquals;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.joda.time.DateTime;
import org.junit.jupiter.api.Test;

import hopara.dataset.filter.Operator;
import hopara.dataset.filter.Filter;
import hopara.dataset.filter.Filters;
import hopara.dataset.row.read.DistanceSort;
import hopara.dataset.row.read.LogicalOperator;
import hopara.dataset.row.read.Pagination;


public class RowReadTest extends RowIntegrationTest {
    @Test
    void find_rows_with_array_filter_exact_match() {
        var filters = new Filters();

        var filter = Filter.unsafeCreate("carros");
        filters.add(filter);

        var cars = new ArrayList<String>();
        cars.add("suzuki");
        cars.add("palio");

        Map<String, Object> values = getAnyValues();
        values.put("carros", cars);
        saveRow(values);

        filter.addValue("palio");
        var retrievedRows = findRows(filters);
        assertEquals(0, retrievedRows.size());
        
        filter.addValue("suzuki");
        retrievedRows = findRows(filters);
        assertEquals(1, retrievedRows.size());
    }

    @Test
    void find_rows_with_array_filter_partial_match() {
        var filters = new Filters();

        var filter = Filter.unsafeCreate("carros");
        filter.setComparisonType(Operator.PARTIAL_MATCH);
        filters.add(filter);

        var cars = new ArrayList<String>();
        cars.add("suzuki");
        cars.add("palio");

        Map<String, Object> values = getAnyValues();
        values.put("carros", cars);
        saveRow(values);

        filter.addValue("suzuki");
        var retrievedRows = findRows(filters);
        assertEquals(1, retrievedRows.size());
    }

    @Test
    void null_values_as_criteria() {
        var galoValues = new HashMap<String, Object>();
        galoValues.put("nome", "Galo");
        galoValues.put("cidade", "Volta Redonda");

        saveRow(galoValues);

        var camargoValues = new HashMap<String, Object>();
        camargoValues.put("nome", "Camargo");
        saveRow(camargoValues);

        var filter = Filter.unsafeCreate("cidade");
        filter.addValue(null);

        var filters = new Filters();
        filters.add(filter);

        var retrievedRows = findRows(filters);
        assertEquals(1, retrievedRows.size());

        var retrievedRow = retrievedRows.get(0);
        assertTrue(retrievedRow.containsKey("nome"));
        assertTrue(retrievedRow.containsValue("Camargo"));
    }

    @Test
    void find_rows_filtered_by_column() {
        var galoValues = new HashMap<String, Object>();
        galoValues.put("nome", "Galo");

        saveRow(galoValues);

        var camargoValues = new HashMap<String, Object>();
        camargoValues.put("nome", "Camargo");
        saveRow(camargoValues);

        var filter = Filter.unsafeCreate("nome");
        filter.addValue("Galo");

        var filters = new Filters();
        filters.add(filter);

        var retrievedRows = findRows(filters);
        assertEquals(1, retrievedRows.size());

        var retrievedRow = retrievedRows.get(0);
        assertTrue(retrievedRow.containsKey("nome"));
        assertTrue(retrievedRow.containsValue("Galo"));
    }

    @Test
    void find_rows_filtered_by_column_with_or_operator() {
        var galoValues = new HashMap<String, Object>();
        galoValues.put("nome", "Galo");
        galoValues.put("idade", 35);

        saveRow(galoValues);

        var camargoValues = new HashMap<String, Object>();
        camargoValues.put("nome", "Camargo");
        camargoValues.put("idade", 30);
        saveRow(camargoValues);

        var nameFilter = Filter.unsafeCreate("nome");
        nameFilter.addValue("Galo");
        nameFilter.setLogicalOperator(LogicalOperator.OR);

        var ageFilter = Filter.unsafeCreate("idade");
        ageFilter.addValue(30);
        ageFilter.setLogicalOperator(LogicalOperator.OR);

        var filters = new Filters();
        filters.add(nameFilter);
        filters.add(ageFilter);

        var retrievedRows = findRows(filters);
        assertEquals(2, retrievedRows.size());
    }

    @Test
    void and_has_precedence_over_or() {
        var galoValues = new HashMap<String, Object>();
        galoValues.put("idade", 35);
        galoValues.put("peso", 80);

        saveRow(galoValues);

        var idadeFilter = Filter.unsafeCreate("idade");
        idadeFilter.addValue(36);
        idadeFilter.setLogicalOperator(LogicalOperator.AND);

        var pesoFilter = Filter.unsafeCreate("peso");
        pesoFilter.addValue(80);
        pesoFilter.setLogicalOperator(LogicalOperator.OR);

        var filters = new Filters();
        filters.add(idadeFilter);
        filters.add(pesoFilter);

        var retrievedRows = findRows(filters);
        assertEquals(0, retrievedRows.size());
    }

    @Test
    void find_rows_filtered_by_colum_partial_match() {
        var galoValues = new HashMap<String, Object>();
        galoValues.put("nome", "Galo");

        saveRow(galoValues);

        var camargoValues = new HashMap<String, Object>();
        camargoValues.put("nome", "Galeto");
        saveRow(camargoValues);

        var filter = Filter.unsafeCreate("nome");
        filter.addValue("gal");
        filter.setComparisonType(Operator.PARTIAL_MATCH);

        var filters = new Filters();
        filters.add(filter);

        var retrievedRows = findRows(filters);
        assertEquals(2, retrievedRows.size());
    }

    @Test
    void find_time_rows_in_range() {
        var today = new Date();
        var tomorrow = new DateTime(today).plusDays(1).toDate();

        Map<String, Object> values = getAnyValues();
        values.put("nascimento", today);
        saveRow(values);

        var matchFilters = new Filters();
        matchFilters.add(new Filter("nascimento", today, Operator.GREATER_EQUALS_THAN));
        matchFilters.add(new Filter("nascimento", tomorrow, Operator.LESS_EQUALS_THAN));

        assertEquals(1, findRows(matchFilters).size());

        var later = new DateTime(today).plusDays(2).toDate();
        var muchLater = new DateTime(today).plusDays(4).toDate();

        var noMatchFilters = new Filters();
        noMatchFilters.add(new Filter("nascimento", later, Operator.GREATER_EQUALS_THAN));
        noMatchFilters.add(new Filter("nascimento", muchLater, Operator.LESS_EQUALS_THAN));

        assertEquals(0, findRows(noMatchFilters).size());
    }
    
    @SuppressWarnings({ "rawtypes" })
    @Test
    void find_intersecting_polygon_rows() {
        var polygon = new Geometry();
        polygon.add(0,0);
        polygon.add(1,0);
        polygon.add(1,1);
        polygon.add(0,1);
        polygon.add(0,0);
        
        Map<String, Object> values = getAnyValues();
        values.put("casa", polygon);
        saveRow(values);
        
        // Same point doenst intersects on singlestore, so we use 0.9
        var intersectingPolygon = new Geometry();
        intersectingPolygon.add(0.9,0.9);
        intersectingPolygon.add(2,0.9);
        intersectingPolygon.add(2,2);
        intersectingPolygon.add(0.9,2);
        intersectingPolygon.add(0.9,0.9);
        
        var matchFilters = new Filters();
        Filter matchFilter = new Filter("casa", Operator.INTERSECTS);
        matchFilter.addValue((List)intersectingPolygon);
        matchFilters.add(matchFilter);
        
        assertEquals(1, findRows(matchFilters).size());
        
        var noIntersectingPolygon = new Geometry();
        noIntersectingPolygon.add(2,2);
        noIntersectingPolygon.add(3,2);
        noIntersectingPolygon.add(3,3);
        noIntersectingPolygon.add(2,3);
        noIntersectingPolygon.add(2,2);
                
        var noMatchFilters = new Filters();
        Filter noMatchFilter = new Filter("casa", Operator.INTERSECTS);
        noMatchFilter.addValue((List)noIntersectingPolygon);
        noMatchFilters.add(noMatchFilter);
        
        assertEquals(0, findRows(noMatchFilters).size());
    }

    @Test
    @SuppressWarnings({"rawtypes"})
    void single_store_weird_bug() {
        var polygon = new Geometry();
        polygon.add(0,0);
        polygon.add(1,0);
        polygon.add(1,1);
        polygon.add(0,1);
        polygon.add(0,0);

        Map<String, Object> values = getAnyValues();
        values.put("casa", polygon);
        saveRow(values);

        var intersectingPolygon = new Geometry();
        intersectingPolygon.add(-170,-80);
        intersectingPolygon.add(170,-80);
        intersectingPolygon.add(170,80);
        intersectingPolygon.add(-170,80);
        intersectingPolygon.add(-170,-80);

        var matchFilters = new Filters();
        Filter matchFilter = new Filter("casa", Operator.INTERSECTS);
        matchFilter.addValue((List)intersectingPolygon);
        matchFilters.add(matchFilter);

        assertEquals(1, findRows(matchFilters).size());
    }

    @Test
    void pagination() {
        var galoValues = new HashMap<String, Object>();
        galoValues.put("nome", "Galo");

        saveRow(galoValues);

        var camargoValues = new HashMap<String, Object>();
        camargoValues.put("nome", "Galeto");
        saveRow(camargoValues);

        var rows1 = findRows(new Pagination(1,0));
        assertEquals("Galeto", rows1.get(0).get("nome"));

        var rows2 = findRows(new Pagination(1,1));
        assertEquals("Galo", rows2.get(0).get("nome"));

        var rows3 = findRows(new Pagination(1,2));
        assertEquals(0, rows3.size());
    }

    @Test
    void distance_sort() {
        Map<String, Object> values1 = getAnyValues();
        values1.put("casa", new Geometry(0, 0));
        saveRow(values1);

        Map<String, Object> values2 = getAnyValues();
        values2.put("casa", new Geometry(1, 1));
        saveRow(values2);

        var distanceColumns = new ArrayList<String>();
        distanceColumns.add("casa");

        var coordinates1 = new ArrayList<Number>();
        coordinates1.add(-1);
        coordinates1.add(-1);

        var distanceSort1 = new DistanceSort(distanceColumns, coordinates1);
        var row1Geometry = (Geometry)findRows(distanceSort1).get(0).get("casa");
        assertNumberEquals(0, row1Geometry.get(0).get(0));
        assertNumberEquals(0, row1Geometry.get(0).get(1));

        var coordinates2 = new ArrayList<Number>();
        coordinates2.add(1);
        coordinates2.add(1);

        var distanceSort2 = new DistanceSort(distanceColumns, coordinates2);
        var row2Geometry = (Geometry)findRows(distanceSort2).get(0).get("casa");
        assertNumberEquals(1, row2Geometry.get(0).get(0));
        assertNumberEquals(1, row2Geometry.get(0).get(1));
    }
}
