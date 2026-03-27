package hopara.dataset.table;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import hopara.dataset.IntegrationTest;
import hopara.dataset.NotFoundException;
import hopara.dataset.column.Column;
import hopara.dataset.column.ColumnType;
import hopara.dataset.row.read.RowReadTableRepository;

public class TableRepositoryTest extends IntegrationTest {
    @Autowired
    TableRepository tableRepository;
    
    @Autowired 
    RowReadTableRepository rowRepository;
    
    Table table;
    
    @BeforeEach
    void setUp() {
    	table = new Table();
    	table.setName("test_table_repository");
    	table.addColumn(new Column("name"));
    	table.addColumn(new Column("age",ColumnType.INTEGER));
    }
    	
	@Test
	void if_not_found_throws_exception() {
		assertThrows(NotFoundException.class, () -> { tableRepository.find(new TableKey("nenem","giiiiii")); });
	}
	
	@Test
	void save_table_also_save_columns() {
		tableRepository.save(table);
		
		var fetchedTable = tableRepository.find(table.getKey());
		var columns = fetchedTable.getColumns();
		
		assertTrue(columns.contains("name"));
		assertEquals(ColumnType.STRING, columns.get("name").getType());
		
		assertTrue(columns.contains("age"));		
		assertEquals(ColumnType.INTEGER, columns.get("age").getType());		
	}
    
	@Test
	void save_table() {
		table.addColumn(new Column("age", ColumnType.INTEGER));
				
		tableRepository.save(table);

		var fetchedTable = tableRepository.find(table.getKey());
		assertNotNull(fetchedTable);		
	}

    @Test
	void find_table_ignore_especial_chars() {				
		tableRepository.save(table);

        var tableKey = new TableKey(table.getKey().getName() + "-");
		var fetchedTable = tableRepository.find(tableKey);
		assertNotNull(fetchedTable);		
	}
}
