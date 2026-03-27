package hopara.dataset.column;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.HashSet;

import org.junit.jupiter.api.Test;

public class ColumnsTest {
    @Test
    public void get_by_name() {
        Column columnA = new Column("columnA");
        Column columnB = new Column("columnB");

        var columns = new Columns();
        columns.add(columnA);
        columns.add(columnB);

        assertEquals(columnA, columns.get("columnA"));
    }
    
    @Test
    public void doesnt_overwrite_column() {
        Column columnAString = new Column("columnA",ColumnType.STRING);
        Column columnAInt = new Column("columnA",ColumnType.INTEGER);

        var columns = new Columns();
        columns.add(columnAString);
        columns.add(columnAInt);

        assertEquals(ColumnType.STRING, columns.get("columnA").getType());
    }
    
    @Test
    public void add_complements_column_information() {
        Column columnAString = new Column("columnA");
        Column columnAInt = new Column("columnA",ColumnType.INTEGER);

        var columns = new Columns();
        columns.add(columnAString);
        columns.add(columnAInt);

        assertEquals(ColumnType.INTEGER, columns.get("columnA").getType());
    }
    
    @Test
    public void intersection() {
        Column columnA = new Column("columnA");
        Column columnB = new Column("columnB"); 
        
        var columns = new Columns();
        columns.add(columnA);
        columns.add(columnB);

        var values = new HashSet<String>();
        values.add("columnA");

        var intersectingColumns = columns.getIntersection(values);
        assertEquals(1, intersectingColumns.size());
        assertEquals("columnA", intersectingColumns.get(0).getName());
    }
}
