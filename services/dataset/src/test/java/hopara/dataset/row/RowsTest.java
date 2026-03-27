package hopara.dataset.row;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

public class RowsTest {
    @Test
    public void set_value_replicates_value_for_all_rows() {
        var row = new Row();
        row.setValue("nome", "Carlos");

        var rows = new Rows();
        rows.add(row);
        rows.setValue("empresa", "B2W");

        assertEquals("B2W", row.getValue("empresa"));
    }
}
