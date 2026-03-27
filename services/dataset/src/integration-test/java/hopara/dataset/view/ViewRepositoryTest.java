package hopara.dataset.view;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.BadSqlGrammarException;

import hopara.dataset.IntegrationTest;
import hopara.dataset.NotFoundException;
import hopara.dataset.column.Column;
import hopara.dataset.column.ColumnRepository;
import hopara.dataset.column.ColumnType;
import hopara.dataset.database.Database;
import hopara.dataset.table.Table;
import hopara.dataset.table.TableRepository;

public class ViewRepositoryTest extends IntegrationTest {

    @Autowired
    ViewRepository viewRepository;

    @Autowired
    TableRepository tableRepository;
    
    @Autowired
    ColumnRepository columnRepository;

    @Autowired
    Database database;
    
    View view;
    View joinedView;
    Table table;
    
    @BeforeEach
    public void setUp() {
        table = new Table(getTestDataSource(),"test_view_repository");
        table.addColumn(new Column("age", ColumnType.INTEGER));
        table.addColumn(new Column("city", ColumnType.STRING));
        table.addColumn(new Column("timestamp", ColumnType.DATETIME));
        tableRepository.save(table);

        joinedView = new View(getTestDataSource(), "test_joinedSumAgeView");
        joinedView.setQuery("SELECT age FROM test_view_repository");
        joinedView.addColumn(new Column("age", ColumnType.INTEGER));

        viewRepository.save(joinedView);

        view = new View(getTestDataSource(),"test_sumAgeView");
        view.addColumn(new Column("sumAge", ColumnType.INTEGER));
        view.addColumn(new Column("city", ColumnType.STRING));

        view.setJoin(joinedView.getId());
        
        view.setQuery("SELECT SUM(age) as sumAge, city FROM test_view_repository GROUP BY cityerrado");
        view.setDatabaseClass(database.getDbClass());
        view.addColumn(new Column("sumAge", ColumnType.INTEGER));
        var editableColumns = new ArrayList<EditableColumn>();
        editableColumns.add(new EditableColumn("city"));
        view.setEditableColumns(editableColumns);
        view.setWriteLevel(WriteLevel.INSERT);
        view.setWriteTableName("test_view_repository");
        view.setPrimaryKeyName("city");
        view.setVersionColumnName("timestamp");
        view.setSmartLoad(false);
        viewRepository.save(view);
    }
    
    @Test
    public void save_view() {        
        var fetchedView = viewRepository.find(view.getKey());

        assertEquals(3, fetchedView.getColumns().size());
        assertEquals("SELECT SUM(age) as sumAge, city FROM test_view_repository GROUP BY cityerrado", fetchedView.getQuery());
        assertEquals("test_sumAgeView", fetchedView.getName());
        assertFalse(fetchedView.shouldSmartLoad());
        assertEquals(WriteLevel.INSERT, fetchedView.getWriteLevel());
        assertEquals("city", fetchedView.getPrimaryKeyName());
        assertEquals("test_view_repository", fetchedView.getWriteTableName());
        assertEquals("timestamp", fetchedView.getVersionColumnName());
        assertTrue(fetchedView.getColumns().get("city").isEditable());
        assertEquals(joinedView.getId(), fetchedView.getJoin());
    }

    @Test
    public void findByQueryText() {
        var result = viewRepository.search("sumAge", getTestDataSource());

        assertEquals(1, result.size());
        assertEquals("test_sumAgeView", result.iterator().next().getName());

        var emptyResult = viewRepository.search("blablablablabla", getTestDataSource());
        assertEquals(0, emptyResult.size());
    } 

    @Test
    public void validate_validates_against_db() {        
        assertThrows(BadSqlGrammarException.class, () -> viewRepository.validate(view));
    }

    @Test
    public void validates_duplicate_column_name() {
        view.setQuery("SELECT 'a' as city, 'b' as city from test_view_repository");        
        assertThrows(IllegalArgumentException.class, () -> viewRepository.validate(view));
    }

    @Test
    public void delete_view() {
        viewRepository.delete(joinedView);
        viewRepository.delete(view);

        assertThrows(NotFoundException.class, () -> {
            viewRepository.find(view.getKey());
        });
    }
}
