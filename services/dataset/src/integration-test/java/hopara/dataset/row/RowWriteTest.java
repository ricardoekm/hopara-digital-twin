package hopara.dataset.row;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import hopara.dataset.column.Column;
import hopara.dataset.database.Database;
import hopara.dataset.filter.Filter;
import hopara.dataset.filter.Filters;
import hopara.dataset.table.IndexRepository;

public class RowWriteTest extends RowIntegrationTest {

    @Autowired
    Database database;

    @Autowired
    IndexRepository indexRepository;
    
    @Test
    void insert_row() {
        var values = new HashMap<String, Object>();
        values.put("nome", "Galo");

        var savedRow = saveRow(values);
        assertTrue(savedRow.containsKey("nome"));
        assertTrue(savedRow.containsValue("Galo"));
    }

    @Test
    void unique_constraint() {
        var uniqueColumns = new ArrayList<String>();
        uniqueColumns.add("peso");

        indexRepository.createUniqueConstraint(getTable().getSqlName(), uniqueColumns);

        var values = new HashMap<String, Object>();
        values.put("peso", 10);

        saveRow(values);
        saveRow(values);

        var rows = findRows();
        assertEquals(1, rows.size());
    }

    @Test
    void insert_with_select() {
        var values = new HashMap<String, Object>();
        values.put("nome", "Galo");

        var rows = new Rows();
        rows.add(getSimpleRow(values));

        var selectColumn = new Column("_id");

        var selectValues = rowWriteRepository.insert(getSavedTable(), rows, selectColumn);
        assertEquals(1, selectValues.size());
        assertNotNull(selectValues.get(0));
    }

    @Test
    void delete() {
        var values = new HashMap<String, Object>();
        values.put("nome", "Galo");

        var rows = new Rows();
        rows.add(getSimpleRow(values));

        var selectColumn = new Column("_id");
        var selectValues = rowWriteRepository.insert(getSavedTable(), rows, selectColumn);

        var noMatchFilters = new Filters();
        noMatchFilters.add(new Filter("_id", 50));
        rowWriteRepository.delete(getSavedTable(),noMatchFilters);
        assertEquals(1, findRows().size());

        var matchFilters = new Filters();
        matchFilters.add(new Filter("_id", selectValues));        
        rowWriteRepository.delete(getSavedTable(),matchFilters);
        assertEquals(0, findRows().size());
    }

    @Test
    void delete_with_all_filters_invalid_throws_exception() {
        var values = new HashMap<String, Object>();
        values.put("nome", "Galo");

        var rows = new Rows();
        rows.add(getSimpleRow(values));

        rowWriteRepository.insert(getSavedTable(), rows, new Column("_id"));

        var invalidFilters = new Filters();
        invalidFilters.add(new Filter("abvd", 50));
        
        assertThrows(IllegalArgumentException.class, () -> rowWriteRepository.delete(getSavedTable(),invalidFilters));
    }

    @Test
    void insert_empty_row() {
        var values = new HashMap<String, Object>();

        var rows = new Rows();
        rows.add(getSimpleRow(values));

        var selectColumn = new Column("_id");

        var selectValues = rowWriteRepository.insert(getSavedTable(), rows, selectColumn);
        assertEquals(1, selectValues.size());
        assertNotNull(selectValues.get(0));
    }

    @Test
    void insert_row_with_missing_columns() {
        var row1Values = new HashMap<String, Object>();
        row1Values.put("nome", "Galo");
        row1Values.put("idade", 34);

        var row2Values = new HashMap<String, Object>();
        row2Values.put("nome", "Camargo");
        row2Values.put("idade", 33);

        List<Row> rows = new ArrayList<Row>();
        rows.add(getSimpleRow(row1Values));
        rows.add(getSimpleRow(row2Values));

        var savedRows = saveRow(getTable(), rows);
        
        var galo = filter(savedRows, "nome", "Galo");
        assertTrue(galo.containsKey("nome"));
        assertTrue(galo.containsValue("Galo"));
        assertTrue(galo.containsKey("idade"));
        assertTrue(galo.containsValue(34));

        var camargo = filter(savedRows, "nome", "Camargo");
        assertTrue(camargo.containsKey("nome"));
        assertTrue(camargo.containsValue("Camargo"));
    }

    @Test
    void updates_with_filters_should_limit_scope() {
        var values = new HashMap<String, Object>();
        values.put("nome", "Galo");
        values.put("cidade", "Volta Redonda");

        var savedRow = saveRow(values);

        var updateValues = new HashMap<String, Object>();
        updateValues.put("cidade", "Rio de Janeiro");

        // Should have no effect
        var camargoFilters = new Filters();
        camargoFilters.add(new Filter("nome", "Camargo"));

        var updatedRow = updateRow((Number) savedRow.get("_id"), updateValues, camargoFilters);
        assertTrue(updatedRow.containsValue("Volta Redonda"));

        // Should have effect
        var galoFilters = new Filters();
        galoFilters.add(new Filter("nome", "Galo"));

        updatedRow = updateRow((Number) savedRow.get("_id"), updateValues, galoFilters);
        assertTrue(updatedRow.containsValue("Rio de Janeiro"));
    }
}
