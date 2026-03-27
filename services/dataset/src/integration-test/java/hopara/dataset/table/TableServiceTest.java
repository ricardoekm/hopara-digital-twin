package hopara.dataset.table;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import hopara.dataset.IntegrationTest;
import hopara.dataset.column.Column;
import hopara.dataset.column.ColumnType;

public class TableServiceTest extends IntegrationTest {
    @Autowired
    TableService tableService;
    
    @Autowired
    TableRepository tableRepository;
    
    @Test
    void if_table_is_not_found_infer_from_db() {
        var table = new Table(getTestDataSource(),"test_table_service_infer");
        table.addColumn(new Column("age",ColumnType.INTEGER));
        table.addColumn(new Column("wage",ColumnType.DECIMAL));
        table.addColumn(new Column("cars",ColumnType.STRING_ARRAY));

        tableRepository.create(table);
                
        var fetchedTable = tableService.find(table.getKey());
        
        assertEquals(3, fetchedTable.getColumns().size());
        
        var fetchedColumn1 = fetchedTable.getColumns().get(0);       
        assertEquals("age", fetchedColumn1.getName());
        assertEquals(ColumnType.INTEGER, fetchedColumn1.getType());

        var fetchedColumn2 = fetchedTable.getColumns().get(1);       
        assertEquals("wage", fetchedColumn2.getName());
        assertEquals(ColumnType.DECIMAL, fetchedColumn2.getType());

        var fetchedColumn3 = fetchedTable.getColumns().get(2);       
        assertEquals("cars", fetchedColumn3.getName());
        assertEquals(ColumnType.STRING_ARRAY, fetchedColumn3.getType());
    }
}
