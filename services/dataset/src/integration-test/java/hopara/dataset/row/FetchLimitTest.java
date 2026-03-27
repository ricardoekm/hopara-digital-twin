package hopara.dataset.row;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

import hopara.dataset.row.read.Pagination;

public class FetchLimitTest extends RowIntegrationTest {			
	@Test
	// We return plus one to know that the limit was surpassed and raise a warning
	void read_returns_table_fetch_limit_plus_1() {
		saveRow(getAnyValues());
		saveRow(getAnyValues());
		saveRow(getAnyValues());
		
		var retrievedRows = findRows(new Pagination(1));
		assertEquals(2,retrievedRows.size());		
	}	
}
