package hopara.dataset.column;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

public class ColumnTest {
	@Test
	public void set_default_type_if_send_unknown_type() {
		var column = new Column();
		column.setType("blablabla");
		
		assertEquals(Column.DEFAULT_TYPE,column.getType());
	}

	@Test
	public void validates_invalid_char() {
		assertThrows(IllegalColumnNameException.class, () -> new Column("asdfaf;"));
	}

	@Test
	public void has_same_name() {
		var column = new Column("id-louco");
		assertTrue(column.hasSameName("id-louco"));
	}
}
