package hopara.dataset.view;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

import hopara.dataset.column.Column;
import hopara.dataset.column.ColumnType;
import hopara.dataset.database.DatabaseClass;
import hopara.dataset.table.Table;
import hopara.dataset.table.Tables;

public class ViewTest {

    @Test
    void cannot_have_cte() {
        // CTEs breaks the stats query
        var view = new View("hopara","my_view");
        var queryText = "WITH blabla AS (select * from blublu)\n"
                      + "SELECT * FROM blabla";
        view.setQuery(queryText);
        view.setDatabaseClass(DatabaseClass.POSTGRES);

        
        assertThrows(IllegalArgumentException.class, () -> { view.validate(); });
    }

    @Test
    void get_query_name_return_valid_identifiers() {
        var view = new View("hopara","3d_máchines");
        assertEquals("_3d_mchines", view.getQueryName());
    }

    @Test
    void get_all_columns_return_view_declared_columns_plus_table_columns() {
        var tables = new Tables();
        
        var table = new Table("hopara","mytable");
        table.addColumn(new Column("mycolumn",ColumnType.DECIMAL));
        
        tables.add(table);

        var view = new View("hopara","myview");
        view.setTables(tables);
        view.addColumn(new Column("mycolumn2",ColumnType.DECIMAL));

        assertEquals(2, view.getAllColumns().size());
    }
    
    @Test
    void declared_columns_overwrite_table_columns() {
        var tables = new Tables();
  
        var table = new Table("hopara","mytable");
        table.addColumn(new Column("mycolumn",ColumnType.DECIMAL));
        
        tables.add(table);

        var view = new View("hopara","myview");
        view.setTables(tables);
        view.addColumn(new Column("mycolumn",ColumnType.DECIMAL));

        assertEquals(1, view.getColumns().size());
        assertEquals(ColumnType.DECIMAL, view.getColumns().get(0).getType());
    }

    @Test
    void assumes_write_table_if_has_only_one_table() {
        var view = new View("hopara", "assets");
        view.setQuery("SELECT * FROM assets as bla");
        view.setDatabaseClass(DatabaseClass.POSTGRES);

        assertEquals("assets", view.getWriteTableName()); 
    }
}
