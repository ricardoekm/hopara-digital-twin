package hopara.dataset.position;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import hopara.dataset.column.Column;
import hopara.dataset.column.ColumnType;
import hopara.dataset.database.Database;
import hopara.dataset.datasource.DataSource;
import hopara.dataset.filter.Filters;
import hopara.dataset.row.Row;
import hopara.dataset.row.RowIntegrationTest;
import hopara.dataset.row.RowService;
import hopara.dataset.table.Table;
import hopara.dataset.view.View;
import hopara.dataset.view.ViewKey;
import hopara.dataset.view.ViewRepository;

import java.util.Date;
import java.util.HashMap;

public class PositionServiceTest extends RowIntegrationTest {
    
    @Autowired
    PositionService positionService;

    @Autowired
    PositionHistoryService positionHistoryService;

    @Autowired
    ViewRepository viewRepository;

    @Autowired
    Database database;

    View positionView;
    PositionTable positionTable;

    @Autowired
    RowService rowService;

    View view;

    @BeforeEach
    void setup() {
        view = new View("myds", "my_view77777");
        var column = new Column("id", ColumnType.INTEGER);
        view.addColumn(column);
        view.setPrimaryKeyName("id");
        view.setDatabaseClass(database.getDbClass());

        positionTable = new PositionTable(view.getDataSourceName(), view.getName());
        positionService.createPositionView(view);

        // We fetch from the repository to have the columns for the column validation test
        positionView = viewRepository.find(new ViewKey("hopara", view.getName() + "_myds_pos"));
    } 

    @Test
    void create_position_view() {
        var columns = positionView.getColumns();

        assertEquals("id", columns.get(0).getName());
        assertEquals(ColumnType.STRING, columns.get(0).getType());
        
        assertEquals("point_2d", columns.get(1).getName());
        assertEquals(ColumnType.GEOMETRY, columns.get(1).getType());

        assertEquals("point_3d", columns.get(2).getName());
        assertEquals(ColumnType.GEOMETRY, columns.get(2).getType());

        assertEquals("line", columns.get(3).getName());
        assertEquals(ColumnType.GEOMETRY, columns.get(3).getType());

        assertEquals("rectangle", columns.get(4).getName());
        assertEquals(ColumnType.GEOMETRY, columns.get(4).getType());

        assertEquals("polygon", columns.get(5).getName());
        assertEquals(ColumnType.GEOMETRY, columns.get(5).getType());

        assertEquals("floor", columns.get(6).getName());
        assertEquals(ColumnType.STRING, columns.get(6).getType());
    }
    
    @Test
    void position_history() {        
        var values = new HashMap<String, Object>();
        values.put("id", "40");
        values.put("tenantId", "50");

        saveRow(positionTable, values);

        var historyTable = new Table(DataSource.DEFAULT_NAME, view.getName() + "_myds_pos_hist");
        var historyRows = findRows(historyTable);        
        assertEquals(1, historyRows.size());

        values = new HashMap<String, Object>();
        values.put("id", "50");
        values.put("tenantId", "60");
        saveRow(positionTable, values);

        historyRows = findRows(historyTable);        
        assertEquals(2, historyRows.size());
    }

    void upsert(PositionTable table, String id, HashMap<String, Object> values) {
        var row = new Row(values);
        row.setId(id);
        rowService.save(table, table.getPrimaryKeyColumn(), row, new Filters(), true);
    }

    @Test
    void rollback() throws InterruptedException {
        var values = new HashMap<String, Object>();
        values.put("floor", "1");
        upsert(positionTable, "idzao", values);

        Thread.sleep(1000);
        var date = new Date();
        values = new HashMap<String, Object>();
        values.put("floor", "2");
        upsert(positionTable, "idzao", values);

        var rows = findRows(positionTable, "id");    
        assertEquals(1, rows.size());
        assertEquals("idzao", rows.get(0).get("id"));
        assertEquals("2", rows.get(0).get("floor"));

        positionHistoryService.rollback(positionView.getKey(), date, new Filters());

        rows = findRows(positionTable, "id");    
        assertEquals(1, rows.size());
        assertEquals("idzao", rows.get(0).get("id"));
        assertEquals("1", rows.get(0).get("floor"));
    }   

    @Test
    void rollback_multiple_rows() throws InterruptedException {
        var values1 = new HashMap<String, Object>();
        values1.put("floor", "1");

        var values2 = new HashMap<String, Object>();
        values2.put("floor", "2");

        upsert(positionTable, "idzao", values1);
        upsert(positionTable, "idzao2", values2);

        Thread.sleep(1000);
        var date = new Date();
        upsert(positionTable, "idzao", values2);
        upsert(positionTable, "idzao2", values1);

        positionHistoryService.rollback(positionView.getKey(), date, new Filters());

        var rows = findRows(positionTable, "id");    
        assertEquals(2, rows.size());
        assertEquals("idzao", rows.get(0).get("id"));
        assertEquals("1", rows.get(0).get("floor"));

        assertEquals("idzao2", rows.get(1).get("id"));
        assertEquals("2", rows.get(1).get("floor"));
    } 

    @Test
    void rollback_to_unpositioned() throws InterruptedException {
        var date = new Date();

        Thread.sleep(1000);
        var values = new HashMap<String, Object>();
        values.put("floor", "1");
        upsert(positionTable, "idzao", values);

        positionHistoryService.rollback(positionView.getKey(), date, new Filters());

        var rows = findRows(positionTable, "id");    
        assertEquals(1, rows.size());
        assertEquals("idzao", rows.get(0).get("id"));
        assertEquals(null, rows.get(0).get("floor"));
    }  

}
