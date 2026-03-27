package hopara.dataset.stats.column;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import hopara.dataset.column.Column;
import hopara.dataset.column.ColumnType;
import hopara.dataset.column.QueryColumnRepository;
import hopara.dataset.database.Database;
import hopara.dataset.row.RowIntegrationTest;
import hopara.dataset.sqlquery.SqlQuery;
import hopara.dataset.table.Table;
import hopara.dataset.view.View;
import hopara.dataset.view.ViewService;

public class QueryColumnRepositoryTest extends RowIntegrationTest {
	
	@Autowired
	QueryColumnRepository columnRepository;
	
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
		table.addColumn(new Column("nascimento",ColumnType.DATETIME));
	    table.addColumn(new Column("casa",ColumnType.GEOMETRY));

		return table;
	}

	@Override
	protected View getView() {
		return null;
	}
	
	@Test
	void get_from_query() {
	    var query = new SqlQuery("SELECT nome, idade, casa FROM test_column_stats_repository", database.getDbClass());
	    var columns = columnRepository.getFromQuery(query);
	    
	    assertEquals(3, columns.size());
	    
	    assertEquals(ColumnType.STRING,columns.get(0).getType());
	    assertEquals("nome",columns.get(0).getName());
	    
	    assertEquals(ColumnType.INTEGER,columns.get(1).getType());
	    assertEquals("idade",columns.get(1).getName());
	    
	    assertEquals(ColumnType.GEOMETRY,columns.get(2).getType());
	    assertEquals("casa",columns.get(2).getName()); 
	}
}
