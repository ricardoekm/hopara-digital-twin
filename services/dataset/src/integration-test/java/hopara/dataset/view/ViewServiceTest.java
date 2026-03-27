package hopara.dataset.view;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import hopara.dataset.IntegrationTest;
import hopara.dataset.column.Column;
import hopara.dataset.column.ColumnType;
import hopara.dataset.database.Database;
import hopara.dataset.table.Table;
import hopara.dataset.table.TableService;
import hopara.dataset.table.Tables;

public class ViewServiceTest extends IntegrationTest {

    @Autowired
    ViewService viewService;
    
    @Autowired
    TableService tableService;
    
    @Autowired
    Database database;

    private Table table;

    private Tables tables;
    
    @BeforeEach
    public void setUp() {
        table = new Table(getTestDataSource(),"test_view_service");
        table.addColumn(new Column("age",ColumnType.INTEGER));
        table.addColumn(new Column("wage",ColumnType.DECIMAL));
        tableService.save(table);
        
        tables = new Tables();
        tables.add(table);
    }
    
    @Test
    public void save_view_overwrites_previous_views() {     
        var view = new View(getTestDataSource(),"test_sumAgeView");
        view.setQuery("SELECT SUM(age) as ageMetric FROM test_view_service");
        view.setDatabaseClass(database.getDbClass());
        view.setTables(tables);
        
        viewService.save(view);
        
        view.setQuery("SELECT MAX(age) as ageMetric FROM test_view_service");
        viewService.save(view);

        var fetchedView = (View)viewService.find(view.getKey());

        assertEquals(1,fetchedView.getColumns().size());
        assertEquals("agemetric",fetchedView.getColumns().get(0).getName());
        assertEquals("SELECT MAX(age) as ageMetric FROM test_view_service",fetchedView.getQuery());
    }
    
    @Test
    public void infer_undeclared_column_types() {
        var view = new View(getTestDataSource(),"test_myView");
        view.setQuery("SELECT AVG(age) as ageAvg, SUM(wage) as wageSum FROM test_view_service");
        view.setDatabaseClass(database.getDbClass());
        view.setTables(tables);
        view.addColumn(new Column("wageSum",ColumnType.DECIMAL));
        
        viewService.save(view);
        
        var fetchedView = (View)viewService.find(view.getKey());
        assertEquals(2,fetchedView.getColumns().size());

        var ageSumColumn = fetchedView.getColumns().get("ageavg"); 
        assertNotNull(ageSumColumn);
        assertEquals(ColumnType.DECIMAL,ageSumColumn.getType());
  
        var wageSumColumn = fetchedView.getColumns().get("wagesum"); 
        assertNotNull(wageSumColumn);
        assertEquals(ColumnType.DECIMAL,wageSumColumn.getType());
    }
    
    // When the user only wants to use alias
    @Test
    public void if_column_is_set_but_type_isnt_use_infered_type() {
        var view = new View("hopara","test_myView");
        view.setQuery("SELECT AVG(age) as ageAvg, SUM(wage) as wageSum FROM test_view_service");
        view.setDatabaseClass(database.getDbClass());
        view.setTables(tables);
        view.addColumn(new Column("wageSum",ColumnType.DECIMAL));
        view.addColumn(new Column("ageAvg"));
        
        viewService.save(view);
        
        var fetchedView = (View)viewService.find(view.getKey());
        assertEquals(2,fetchedView.getColumns().size());

        var ageSumColumn = fetchedView.getColumns().get("ageavg"); 
        assertNotNull(ageSumColumn);
        assertEquals(ColumnType.DECIMAL,ageSumColumn.getType());
    }
}
