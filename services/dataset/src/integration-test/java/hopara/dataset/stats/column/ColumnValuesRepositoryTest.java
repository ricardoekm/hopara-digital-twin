package hopara.dataset.stats.column;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import hopara.dataset.column.Column;
import hopara.dataset.column.ColumnType;
import hopara.dataset.column.ColumnValuesRepository;
import hopara.dataset.database.Database;
import hopara.dataset.filter.Operator;
import hopara.dataset.filter.Filter;
import hopara.dataset.filter.Filters;
import hopara.dataset.row.RowIntegrationTest;
import hopara.dataset.table.Table;
import hopara.dataset.view.View;

public class ColumnValuesRepositoryTest extends RowIntegrationTest {
    @Autowired
	ColumnValuesRepository columnValuesRepository;

	int maxLength;
	int fetchLimit;
    	
	Map<String,Object> camargo;
	Map<String,Object> bradock;
	Map<String,Object> emptyRow;
	Map<String,Object> nullRow;

    @Autowired
	Database database;

	protected Table getTable() {
		var table = new Table(getTestDataSource(),"test_column_values_repository");
		table.addColumn(new Column("nome",ColumnType.STRING));
	    table.addColumn(new Column("filhos",ColumnType.BOOLEAN));
		table.addColumn(new Column("idade",ColumnType.INTEGER));
		table.addColumn(new Column("carros",ColumnType.STRING_ARRAY));

		return table;
	}

	protected View getTableView() {
		var view  = new View(getTestDataSource(),"test_column_filter_repository_view");
		view.setQuery("SELECT * FROM " + getTable().getSqlName());
		view.addColumns(getTable().getColumns());
		view.setDatabaseClass(database.getDbClass());

		return view;
	}

	@Override
	protected View getView() {
		return null;
	}

    @BeforeEach
	void setUp() {
		fetchLimit = columnValuesRepository.getFetchLimit();
        		
		emptyRow = new HashMap<>();
		emptyRow.put("nome", "");

		nullRow = new HashMap<>();
		nullRow.put("nome", null);

        var camargoCars = new ArrayList<String>();
		camargoCars.add("Fusca");
		
		camargo = new HashMap<>();
		camargo.put("nome", "Camargo");
		camargo.put("idade", 20);		
		camargo.put("carros", camargoCars);
		camargo.put("avatar", "foto do camargo");
		camargo.put("filhos",true);

        bradock = new HashMap<>();
		bradock.put("nome", "Bradock");
		bradock.put("idade", 25);
		bradock.put("avatar", "foto do brad");
		bradock.put("filhos", false);
		
		var bradockCars = new ArrayList<String>();
		bradockCars.add("Suzuki");
		bradockCars.add("Palio");
		bradock.put("carros", bradockCars);
    }

    @AfterEach
	void tearDown() {
		columnValuesRepository.setFetchLimit(fetchLimit);
	}

    @Test
	void integer_values() {
		saveRow(camargo);
		saveRow(bradock);

		var values = columnValuesRepository.getValues(getTableView(), "idade", columnValuesRepository.fetchLimit);
		
		assertEquals(2,values.size());
		assertTrue(values.contains(20));
		assertTrue(values.contains(25));		
	}
	
    @Test
    void boolean_values() {
        saveRow(camargo);
        saveRow(bradock);

        var values = columnValuesRepository.getValues(getTableView(), "filhos", columnValuesRepository.fetchLimit);
        
        assertEquals(2,values.size());
        assertTrue(values.contains(true));
        assertTrue(values.contains(false));      
    }
	
	@Test
	void fetch_values_based_on_criteria() {
		saveRow(camargo);
		saveRow(bradock);

        var filters = new Filters();
        filters.add(new Filter("nome", "Bra", Operator.PARTIAL_MATCH));
		
		var values = columnValuesRepository.getValues(getTableView(), "nome", filters, 2 );
		
		assertEquals(values.size(), 1);
		assertTrue(values.contains("Bradock"));		
	}

	@Test
	void fetch_values_based_on_integer_criteria() {
		saveRow(camargo);
		saveRow(bradock);

        var filters = new Filters();
        filters.add(new Filter("idade", "2", Operator.PARTIAL_MATCH));
		
		var values = columnValuesRepository.getValues(getTableView(), "idade", filters, 2 );
		
		assertEquals(values.size(), 2);
		assertTrue(values.contains(20));		
	}

	@Test
	void fetch_values_ignore_duplicates() {
		saveRow(camargo);
        saveRow(camargo);
		saveRow(bradock);
        saveRow(bradock);
		
		var values = columnValuesRepository.getValues(getTableView(), "nome", null );
		
		assertEquals(values.size(), 2);
	}

	@Test
	void search_is_case_insensitive() {
		saveRow(bradock);
	    
        var filters = new Filters();
        filters.add(new Filter("nome", "Bra", Operator.PARTIAL_MATCH));

		var values = columnValuesRepository.getValues(getTableView(), "nome", filters, 2 );
		
		assertEquals(values.size(), 1);
		assertTrue(values.contains("Bradock"));		
	}

	@Test
	void fetch_values() {
		saveRow(camargo);
		saveRow(bradock);
		
		var values = columnValuesRepository.getValues(getTableView(), "nome", columnValuesRepository.fetchLimit);
		
		assertEquals(values.size(), 2);
		assertTrue(values.contains("Camargo"));
		assertTrue(values.contains("Bradock"));		
	}

	@Test
	void values_are_ordered_based_on_count() {		
		saveRow(camargo);
		saveRow(camargo);
		saveRow(camargo);
		saveRow(bradock);

		var values = columnValuesRepository.getValues(getTableView(),"nome", columnValuesRepository.fetchLimit);
		
		assertEquals(2, values.size());
		assertEquals("Camargo", values.get(0));
		assertEquals("Bradock", values.get(1));
	}
	
	@Test
	void return_quantity_should_be_limited() {		
		saveRow(camargo);
		saveRow(bradock);

		var values = columnValuesRepository.getValues(getTableView(), "nome", 1);
		
		assertEquals(values.size(), 1);
	}
	
	@Test
	void limit_cant_surpass_global_limit() {		
		saveRow(camargo);
		saveRow(bradock);

		columnValuesRepository.setFetchLimit(1);
		var values = columnValuesRepository.getValues(getTableView(), "nome", 2);
		
		assertEquals(values.size(), 1);
	}
	
	@Test
	void assumes_global_limit_if_no_limit_is_passed() {		
		saveRow(camargo);
		saveRow(bradock);

		columnValuesRepository.setFetchLimit(1);
		var values = columnValuesRepository.getValues(getTableView(), "nome", null);
		
		assertEquals(values.size(), 1);
	}
	
	@Test
	void ignore_empty_and_null_fields() {		
		saveRow(emptyRow);
		saveRow(nullRow);
		saveRow(bradock);

		columnValuesRepository.setFetchLimit(1);
		var values = columnValuesRepository.getValues(getTableView(), "nome", null);
		
		assertEquals(1, values.size());
		assertTrue(values.contains("Bradock"));
	}
	
	@Test
	void on_unsupported_types_returns_empty() {	
		saveRow(bradock);
		saveRow(camargo);
				
		var values = columnValuesRepository.getValues(getTableView(), "carros", null);
		assertEquals(0, values.size());
	}
}
