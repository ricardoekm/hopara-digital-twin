package hopara.dataset.table;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.ArrayList;

import org.junit.jupiter.api.Test;

import hopara.dataset.column.Column;

public class TableTest {	
	// To prevent SQL injection
	@Test
	void removes_non_alphanumeric_chars() {
		var table = new Table();
		table.setName("mySpace!!!");

		assertEquals("mySpace",table.getName());
	}

	@Test
	void get_missing_columns() {
		var table = new Table();
		table.setName("tabela_legal");
		table.addColumn(new Column("pessoa_legal"));

		var columns = new ArrayList<String>();
		columns.add("pessoa_chata");
		columns.add("pessoa_legal");

		var missingColumns = table.getMissingColumns(columns);
		assertEquals(1, missingColumns.size());
		assertEquals("pessoa_chata", missingColumns.get(0));
	}
}
