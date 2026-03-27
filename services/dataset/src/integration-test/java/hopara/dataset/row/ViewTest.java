package hopara.dataset.row;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import hopara.dataset.column.Column;
import hopara.dataset.column.ColumnType;
import hopara.dataset.filter.Operator;
import hopara.dataset.filter.Filter;
import hopara.dataset.filter.Filters;
import hopara.dataset.row.read.Pagination;
import hopara.dataset.table.Table;
import hopara.dataset.view.View;
import hopara.dataset.view.ViewRepository;

public class ViewTest extends RowIntegrationTest {

    @Autowired
    ViewRepository viewRepository;   
    
	protected Table getTable() {
		var table = new Table();
		table.setName("test_view_test_pessoas");
        table.setDataSourceName("hopara");
		
		table.addColumn("cidade");
	    table.addColumn("trabalho");
		table.addColumn(new Column("idade", ColumnType.INTEGER));
		table.addColumn("data");
						
		return table;
	}
	
    protected View getView() {
       var view = new View(getTestDataSource(),"pessoas_cidade");
           
       view.setTables(getTables());
       view.setQuery("SELECT cidade, AVG(idade) AS avg_idade FROM test_view_test_pessoas GROUP BY cidade");
       view.setDatabaseClass(database.getDbClass());

       Column cidadeColumn = new Column("cidade");       
       view.addColumn(cidadeColumn);
       view.addColumn(new Column("avg_idade",ColumnType.DECIMAL));
       
        return view;
    }
	
    private Object round(Object bigDecimal) {
        return ((BigDecimal)bigDecimal).setScale(0, RoundingMode.FLOOR);
    }
    
    private void assertNumberEquals(Long numberA, Object numberB) {
        assertEquals(new BigDecimal(numberA), round(numberB));
    }
    
    @Test
    void filters_work_with_aggregated_columns() {
        var galoRow = new HashMap<String,Object>();
        galoRow.put("cidade", "VR");
        galoRow.put("idade", 30);
        saveRow(galoRow);
        
        var bradRow = new HashMap<String,Object>();
        bradRow.put("cidade", "Rio");
        bradRow.put("idade", 40);
        saveRow(bradRow);
        
        var filters = new Filters();
        filters.add(new Filter("avg_idade","35",Operator.GREATER_EQUALS_THAN));
        
        var retrievedRows = findRows(filters);
        assertEquals(1, retrievedRows.size());
        assertEquals("Rio", retrievedRows.get(0).get("cidade"));
    }

	@Test
	void should_return_calculated_column() {
		var galoRow = new HashMap<String,Object>();
		galoRow.put("cidade", "VR");
		galoRow.put("idade", 30);
		galoRow.put("data", "01/01/2021");
		saveRow(galoRow);

		var camargoRow = new HashMap<String,Object>();
		camargoRow.put("cidade", "VR");
		camargoRow.put("idade", 40);
		camargoRow.put("data", "01/02/2021");
		saveRow(camargoRow);

		var bradRow = new HashMap<String,Object>();
		bradRow.put("cidade", "Macae");
		bradRow.put("idade", 40);
		bradRow.put("data", "01/03/2021");
		saveRow(bradRow);

		var retrievedRows = findRows();
		assertEquals(2, retrievedRows.size());
		
		var row1 = retrievedRows.get(0);
		assertEquals("Macae", row1.get("cidade"));
		assertNumberEquals(40l, row1.get("avg_idade"));

		var row2 = retrievedRows.get(1);
		assertEquals("VR", row2.get("cidade"));
		assertNumberEquals(35l, row2.get("avg_idade"));
	}
	
	@Test
    void limits_result() {
        var galoRow = new HashMap<String,Object>();
        galoRow.put("cidade", "VR");
        galoRow.put("idade", 30);
        galoRow.put("data", "01/01/2021");
        saveRow(galoRow);

        var bradRow = new HashMap<String,Object>();
        bradRow.put("cidade", "Macae");
        bradRow.put("idade", 40);
        bradRow.put("data", "01/03/2021");
        saveRow(bradRow);

        // We return an additional row to inform whether this was a partial response
        var retrievedRows = findRows(new Pagination(0));
        assertEquals(1, retrievedRows.size());;
    }
}
