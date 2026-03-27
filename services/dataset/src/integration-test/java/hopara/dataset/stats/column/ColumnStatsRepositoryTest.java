package hopara.dataset.stats.column;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import hopara.dataset.column.Column;
import hopara.dataset.column.ColumnRepository;
import hopara.dataset.column.ColumnType;
import hopara.dataset.column.Columns;
import hopara.dataset.database.Database;
import hopara.dataset.row.Geometry;
import hopara.dataset.row.RowIntegrationTest;
import hopara.dataset.table.Table;
import hopara.dataset.time.DateParser;
import hopara.dataset.view.View;
import hopara.dataset.view.ViewService;

public class ColumnStatsRepositoryTest extends RowIntegrationTest {
	
	@Autowired
	ColumnRepository columnRepository;
	
	@Autowired
	ColumnStatsRepository columnStatsRepository;
	
	@Autowired
	Database database;

	@Autowired
	ViewService viewService;
		
	Map<String,Object> camargo;
	Map<String,Object> bradock;

	protected Table getTable() {
		var table = new Table(getTestDataSource(), "test_column_stats_repository");
		table.addColumn(new Column("nome",ColumnType.STRING));
		table.addColumn(new Column("idade",ColumnType.INTEGER));
		table.addColumn(new Column("carros",ColumnType.STRING_ARRAY));
        table.addColumn(new Column("di_maior",ColumnType.BOOLEAN));
		table.addColumn(new Column("nascimento",ColumnType.DATETIME));
	    table.addColumn(new Column("casa",ColumnType.GEOMETRY));

		return table;
	}

	protected View getTableView() {
	    var view = new View(getTestDataSource(), "test_column_filter_repository_table_view");
		view.setDatabaseClass(database.getDbClass());
	    view.setQuery("SELECT * FROM " + getTable().getSqlName());

        view.getColumns().addAll(getTable().getColumns());

		return view;
	}
	
	protected View getView() {
	    var view = new View(getTestDataSource(),"test_column_filter_repository_view");
		view.setDatabaseClass(database.getDbClass());
	    view.setQuery("SELECT AVG(idade) as media_idade, di_maior FROM test_column_stats_repository GROUP BY nome, di_maior");
	    
        view.addColumn(new Column("media_idade",ColumnType.INTEGER));
        view.addColumn(new Column("di_maior",ColumnType.BOOLEAN));
	    
	    return view;
	}

	protected View getSavedTableView() {
		return viewService.find(getTableView().getKey());
	}
	
	@BeforeEach
	void setUp() {
		var camargoCars = new ArrayList<String>();
		camargoCars.add("Fusca");
		
		camargo = new HashMap<>();
		camargo.put("nome", "Camargo");
		camargo.put("idade", 20);		
		camargo.put("carros", camargoCars);
		camargo.put("nascimento", DateParser.parse("01/07/1986"));
		camargo.put("avatar", "foto do camargo");
        camargo.put("di_maior", true);

        var camargoHouse = new Geometry();
        camargoHouse.add(0,2);
        camargoHouse.add(2,1);
        camargoHouse.add(2,3);
        camargoHouse.add(0,2);	
        
        camargo.put("casa", camargoHouse);
	
		bradock = new HashMap<>();
		bradock.put("nome", "Bradock");
		bradock.put("idade", 25);
		bradock.put("nascimento",  DateParser.parse("06/07/1987"));
		bradock.put("avatar", "foto do brad");
        bradock.put("di_maior", true);
		
		var bradockCars = new ArrayList<String>();
		bradockCars.add("Suzuki");
		bradockCars.add("Palio");
		bradock.put("carros", bradockCars);

		viewService.save(getTableView());
	}
	
	HashMap<String,Object> createRow(Integer idade, String name) {
		var row = new HashMap<String,Object>();
		row.put("nome", name);
		row.put("idade", idade);
		
		return row;
	}
	
	@Test
	void find_view_stats() {
	    saveRow(bradock);
	    saveRow(camargo);
	    
	    columnStatsRepository.refreshStats(getView());
	    
	    Columns columns = getSavedView().getColumns();
	    var mediaIdadeColumn = columns.get("media_idade");
	    var mediaIdadeStats = mediaIdadeColumn.getStats();
	    
	    assertEquals(20, mediaIdadeStats.getMin());
	    assertEquals(25, mediaIdadeStats.getMax());

        var diMaiorColumn = columns.get("di_maior");
        var diMaiorStats = diMaiorColumn.getStats();

        var values = diMaiorStats.getValues().iterator();
        assertEquals("false", values.next());
        assertEquals("true", values.next());
	}
	
	public void assertNumberEquals(Number a, Number b) {
	    if ( a instanceof BigDecimal && b instanceof Integer ) {
	        b = new BigDecimal((Integer)b);
	    }    
	    
	    assertEquals(a, b);
	}

	@Test
	void find_include_column_stats() {
		for ( int i = 1; i <= 40; i++) {
			saveRow(createRow(i, "Fulano"));	
		}			
		
		columnStatsRepository.setPercentilStep(new BigDecimal("0.25"));
		columnStatsRepository.refreshStats(getTableView());
		
		var columns = getSavedTableView().getColumns();
		var idadeColumn = columns.get("idade");
		var idadeStats = idadeColumn.getStats();
		
		assertEquals(1, idadeStats.getMin());
		assertEquals(40, idadeStats.getMax());

		var percentiles = idadeStats.getPercentiles();
		assertEquals(5, percentiles.size());
		
		var iterator = percentiles.iterator();
		assertNumberEquals(new BigDecimal(1), iterator.next());
		assertNumberEquals(new BigDecimal(10L), iterator.next());
		assertNumberEquals(new BigDecimal(20L), iterator.next());
		assertNumberEquals(new BigDecimal(30L), iterator.next());
		assertNumberEquals(new BigDecimal(40L), iterator.next());
	}

	@Test
	void string_stats() {
		var anyAge = 10;
		saveRow(createRow(anyAge, "Brad"));
		saveRow(createRow(anyAge, "Brad"));	
		saveRow(createRow(anyAge, "Brad"));	
		saveRow(createRow(anyAge, "Camargo"));	
		saveRow(createRow(anyAge, "Camargo"));	
		saveRow(createRow(anyAge, "Galo"));	

		columnStatsRepository.refreshStats(getTableView());

		var columns = getSavedTableView().getColumns();
		var nomeColumn = columns.get("nome");
		var values = nomeColumn.getStats().getValues();

		assertEquals(3, values.size());
		
		var iterator = values.iterator();
		assertEquals("Brad", iterator.next());
	}

	@Test
	void stats_works_with_date() {
	    saveRow(bradock);
        saveRow(camargo);
        
        columnStatsRepository.refreshStats(getTableView());
        
        var columns = getSavedTableView().getColumns();
        columns.get("nascimento").getStats();

        //assertEquals(getEpoch(camargo.get("nascimento")), nascimentoStats.getMin());
        //assertEquals(getEpoch(bradock.get("nascimento")), nascimentoStats.getMax());
	}
}
