package hopara.dataset.row;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.math.BigDecimal;
import java.util.HashMap;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import hopara.dataset.column.Column;
import hopara.dataset.column.ColumnType;
import hopara.dataset.filter.Filter;
import hopara.dataset.filter.Filters;
import hopara.dataset.row.read.Pagination;
import hopara.dataset.table.Table;
import hopara.dataset.table.Tables;
import hopara.dataset.transform.NullTransform;
import hopara.dataset.view.View;
import hopara.dataset.view.Views;

public class ComplexViewTest extends RowIntegrationTest {

	Table pessoasTable;
	Table pagamentosTable;
	private HashMap<String, Object> galoRow;
	private HashMap<String, Object> galoPagamentoRow;
	private HashMap<String, Object> camargoRow;
	private HashMap<String, Object> camargoPagamentoRow;
	
	@BeforeEach
	void setUp() {
		galoRow = new HashMap<String,Object>();
		galoRow.put("nome", "Galo");
		
		galoPagamentoRow = new HashMap<String,Object>();
		galoPagamentoRow.put("nome", "Galo");
		galoPagamentoRow.put("categoria", "fundador");
		
		camargoPagamentoRow = new HashMap<String,Object>();
		camargoPagamentoRow.put("nome", "Camargo");
		camargoPagamentoRow.put("categoria", "socio");
		
		camargoRow = new HashMap<String,Object>();
		camargoRow.put("nome", "Camargo");
	}
	
	@Override
	protected Tables getTables() {
		var tables = new Tables();
		
		pessoasTable = new Table();
		pessoasTable.setName("test_complex_view_pessoas");
		pessoasTable.addColumn("nome");
		
	    tables.add(pessoasTable);
		
		pagamentosTable = new Table();
		pagamentosTable.setName("pagamentos");
		pagamentosTable.addColumn(new Column("valor", ColumnType.DECIMAL));
		pagamentosTable.addColumn("nome");
		pagamentosTable.addColumn("categoria");

		tables.add(pagamentosTable);

		return tables;
	}
	
	@Override
	protected View getView() {
	    var view = new View(getTestDataSource(),"pagamentos_pessoas");
		view.setDatabaseClass(database.getDbClass());
	    view.setQuery("SELECT pes.nome, SUM(valor) as totalPagamento FROM test_complex_view_pessoas AS pes INNER JOIN pagamentos AS pag ON pes.nome = pag.nome GROUP BY pes.nome");
	    view.setTables(getTables());
		view.setFilterTables(true);
	    
	    return view;
	}
	
    protected View getDoubleJoinView() {
        var view = new View(getTestDataSource(),"pagamentos_pessoas_double");
		view.setDatabaseClass(database.getDbClass());
        view.setQuery("SELECT pes.nome, SUM(pag1.valor) as totalPagamento FROM test_complex_view_pessoas AS pes INNER JOIN pagamentos AS pag1 ON pes.nome = pag1.nome INNER JOIN pagamentos AS pag2 ON pes.nome = pag2.nome GROUP BY pes.nome");
        view.setTables(getTables());
		view.setFilterTables(true);
        
        return view;
    }
	
	@Override
    protected Views getViews() {
       var views = new Views();
       
       views.add(getView());       
       views.add(getDoubleJoinView());
    
       return views;
    }
	
	@Test
	void join_to_another_table_in_same_dataset() {
		galoPagamentoRow.put("valor", 10000);
		
		saveRow(pessoasTable, getSimpleRow(galoRow));
		saveRow(pagamentosTable, getSimpleRow(galoPagamentoRow));

		camargoPagamentoRow.put("valor", 5000);
		
		saveRow(pessoasTable, getSimpleRow(camargoRow));
		saveRow(pagamentosTable, getSimpleRow(camargoPagamentoRow));

		var retrievedRows = findRows();
		assertEquals(2, retrievedRows.size());
		
		var row1 = filter(retrievedRows, "nome", "Camargo");
		assertEquals("Camargo", row1.get("nome"));
		assertEquals(new BigDecimal("5000.00000000"), row1.get("totalPagamento"));

		var row2 = filter(retrievedRows, "nome", "Galo");;
		assertEquals("Galo", row2.get("nome"));
		assertEquals(new BigDecimal("10000.00000000"), row2.get("totalPagamento"));
	}
	

    @Test
    void joins_on_the_same_table() {
        rowReadViewRepository.find(getDoubleJoinView(), new NullTransform(), new Filters(), new Pagination(100));
    }
	
	@Test
	void filters_on_joined_table() {
		galoPagamentoRow.put("valor", 10000);
		galoPagamentoRow.put("categoria", "fundador");

		saveRow(pessoasTable, getSimpleRow(galoRow));
		saveRow(pagamentosTable, getSimpleRow(galoPagamentoRow));

		camargoPagamentoRow.put("valor", 5000);
		camargoPagamentoRow.put("categoria", "socio");
		
		saveRow(pessoasTable, getSimpleRow(camargoRow));
		saveRow(pagamentosTable, getSimpleRow(camargoPagamentoRow));

		var filters = new Filters();
		var filter = Filter.unsafeCreate("categoria");
		filter.addValue("socio");
		filters.add(filter);
		
		var retrievedRows = findRows(filters);
		assertEquals(1, retrievedRows.size());
		
		var row1 = retrievedRows.get(0);
		assertEquals("Camargo", row1.get("nome"));
	}

}
