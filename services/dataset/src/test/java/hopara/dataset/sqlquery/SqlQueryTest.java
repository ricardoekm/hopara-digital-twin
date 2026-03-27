package hopara.dataset.sqlquery;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

public class SqlQueryTest {	
	@Test
	void add_cte() {
		var query = new SqlQuery("SELECT * FROM people");
        query.addCte("people", "SELECT * FROM other_people");
        query.addCte("payment", "SELECT * FROM other_payment");
        
        String expectedQueryText = "WITH people AS (SELECT * FROM other_people),\n" +
        						   "payment AS (SELECT * FROM other_payment)\n" +
        						   "SELECT * FROM people";
        
        assertEquals(expectedQueryText,query.toString());
	}

	@Test
	void add_cte_append_false_should_return_table_in_the_beginning_of_the_list() {
		var query = new SqlQuery("SELECT * FROM people");
        query.addCte("people", "SELECT * FROM other_people");
        query.addCte("payment", "SELECT * FROM other_payment", AddMode.PREPEND);
        
        String expectedQueryText = "WITH payment AS (SELECT * FROM other_payment),\n" +
        						   "people AS (SELECT * FROM other_people)\n" +
        						   "SELECT * FROM people";
        
        assertEquals(expectedQueryText,query.toString());
	}
	
	@Test
	void add_limit() {
	    var query = new SqlQuery("SELECT * FROM people");
	    query.setLimit(10);

	    String expectedQueryText = "SELECT * FROM people LIMIT 10";
        assertEquals(expectedQueryText,query.toString());
	}
	
    
    @Test
    void set_limit_from() {
        var query1 = new SqlQuery("SELECT * FROM people LIMIT 10");
        var query2 = new SqlQuery("SELECT * FROM other_people LIMIT 20");
        
        query1.setLimitFrom(query2);
        
        String expectedQueryText = "SELECT * FROM people LIMIT 20";

        assertEquals(expectedQueryText, query1.toString());
    }
	
    @Test
    void set_limit_replaces_limit_if_exists() {
        var query = new SqlQuery("SELECT * FROM people LIMIT 30");
        query.setLimit(10);

        String expectedQueryText = "SELECT * FROM people LIMIT 10";
        assertEquals(expectedQueryText,query.toString());
    }
	
	@Test
	void add_group_by_column() {
		var query = new SqlQuery("SELECT metricA FROM people");
		query.addGroupByColumn("metricA", "people");
		
		String expectedQueryText = "select \n" + 
								   "metricA\n" + 
								   " from \n" + 
								   "people\n" + 
								   " group  by people.metricA";
		
        assertEquals(expectedQueryText,query.toString());
	}
	
	@Test
	void append_group_by_column() {
		var query = new SqlQuery("SELECT metricA, metricB FROM people GROUP BY metricA");
		query.addGroupByColumn("metricB", "people");
		
		String expectedQueryText = "select \n" + 
								   "metricA,metricB\n" + 
								   " from \n" + 
								   "people\n" + 
								   " group  by metricA,people.metricB";
		
        assertEquals(expectedQueryText,query.toString());
	}
	
	@Test
	void get_table_names() {
		var queryText = "SELECT nome, SUM(valor) as totalPagamento FROM pessoas INNER JOIN pagamentos AS pa ON pessoas.nome = pa.nome GROUP BY nome";
		
		var query = new SqlQuery(queryText);
		var tableNames = query.getTableNames();
		
		assertEquals(2,tableNames.size());
		
		var iterator = tableNames.iterator();
		assertEquals("pessoas", iterator.next());		
		assertEquals("pagamentos", iterator.next());
	}

	@Test
	void get_table_names_select_in_select() {
		var queryText = """
							SELECT name,
							(EXISTS(SELECT 1 FROM reservations r
										WHERE a.id = r.equipment_id)) AS reserved
							FROM assets;
						""";
		
		var query = new SqlQuery(queryText);
		var tables = query.getTableNames();
		
		assertEquals(2,tables.size());
		
		var iterator = tables.iterator();
		assertEquals("assets", iterator.next());		
		assertEquals("reservations", iterator.next());
	}

	@Test
	void get_table_names_select_in_select_in_join() {
		var queryText = """
				SELECT r.id
				FROM rooms r
				LEFT JOIN (
					SELECT a.id,
						(EXISTS(SELECT 1
								FROM reservations r
								WHERE a.id = r.equipment_id))     AS reserved
					FROM assets_view a
				) a on r.id = a.room_id
		""";
		
		var query = new SqlQuery(queryText);
		var tables = query.getTableNames();
		
		assertEquals(3,tables.size());
		
		var iterator = tables.iterator();
		assertEquals("rooms", iterator.next());		
		assertEquals("reservations", iterator.next());
		assertEquals("assets_view", iterator.next());
	}
	
	@Test
	void get_table_names_sub_query() {
	    var queryText = "SELECT sensors.*, t.temperature\n"
        	            + "FROM sensors\n"
        	            + "LEFT JOIN (\n"
        	            + "    SELECT input, avg(temperature) as temperature\n"
        	            + "    FROM metrics \n"
        	            + "    GROUP BY input\n"
        	            + ") t on t.input = sensors.device";
	    
	    var query = new SqlQuery(queryText);
	    var tables = query.getTableNames();
	        
	    assertEquals(2,tables.size());

		var iterator = tables.iterator();
	    assertEquals("sensors", iterator.next());
	    assertEquals("metrics", iterator.next());
	}
	
	@Test
    void removes_trailing_semi_colon()  {
		var queryText = "SELECT * from my_table; ";
        var query = new SqlQuery(queryText);

        
        assertEquals("SELECT * from my_table", query.toString());
		
	}
}
