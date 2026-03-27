package hopara.dataset.row;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.HashMap;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import hopara.dataset.IntegrationTest;
import hopara.dataset.column.Column;
import hopara.dataset.column.ColumnType;
import hopara.dataset.filter.Filters;
import hopara.dataset.table.Table;
import hopara.dataset.table.TableService;
import hopara.dataset.view.View;
import hopara.dataset.view.ViewService;

public class UpsertTest extends IntegrationTest {
    @Autowired
    RowService rowService;

    @Autowired
    TableService tableService;

    @Autowired
    ViewService viewService;

    View view;

    @BeforeEach
    void setUp() {
        var table = new Table(getTestDataSource(), "test_upsert");
        table.addColumn(new Column("id", ColumnType.INTEGER));
        table.addColumn(new Column("nome", ColumnType.STRING));
        table.addColumn(new Column("versao", ColumnType.INTEGER));
        tableService.save(table);

        view = new View(getTestDataSource(), "test_upsert_view");
        view.setQuery("SELECT * FROM test_upsert");
        view.setPrimaryKeyName("id");
        view.setUpsert(true);
        view.setWriteTableName("test_upsert");
        view.setVersionColumnName("versao");
        viewService.save(view);
    }

    @Test
    void upsert_view() {
        var values = new HashMap<String, Object>();
        values.put("nome", "Galo");

        rowService.save(view.getKey(), new Row(10, values), new Filters());
        var savedValues = rowService.find(view.getKey(), 10, new Filters());

        assertEquals("Galo", savedValues.get("nome"));
        assertEquals(10,  savedValues.get("id"));

        values.put("nome", "Galo2");
        rowService.save(view.getKey(), new Row(10, values), new Filters());
        savedValues = rowService.find(view.getKey(), 10, new Filters());

        assertEquals("Galo2", savedValues.get("nome"));
        assertEquals(10,  savedValues.get("id"));
    }

    @Test
    void upsert_view_with_version_column() {
        var values = new HashMap<String, Object>();
        values.put("nome", "Galo");
        values.put("versao", 2);

        rowService.save(view.getKey(), new Row(10, values), new Filters());
        var savedValues = rowService.find(view.getKey(), 10, new Filters());

        assertEquals("Galo", savedValues.get("nome"));
        assertEquals(10,  savedValues.get("id"));

        values.put("nome", "Galo2");
        values.put("versao", 1);

        rowService.save(view.getKey(), new Row(10, values), new Filters());
        savedValues = rowService.find(view.getKey(), 10, new Filters());

        assertEquals("Galo", savedValues.get("nome"));
        assertEquals(10,  savedValues.get("id"));
    }

    @Test
    void upsert_table() {
        var values = new HashMap<String, Object>();
        values.put("nome", "Galo");

        rowService.save(view.getWriteTableKey(), new Row(10, values), new Filters());
        var savedValues = rowService.find(view.getKey(), 10, new Filters());

        assertEquals("Galo", savedValues.get("nome"));
        assertEquals(10,  savedValues.get("id"));

        values.put("nome", "Galo2");
        rowService.save(view.getWriteTableKey(), new Row(10, values), new Filters());
        savedValues = rowService.find(view.getKey(), 10, new Filters());

        assertEquals("Galo2", savedValues.get("nome"));
        assertEquals(10,  savedValues.get("id"));
    }
}
