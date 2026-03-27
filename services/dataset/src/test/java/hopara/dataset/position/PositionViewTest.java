package hopara.dataset.position;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import hopara.dataset.column.Column;
import hopara.dataset.column.ColumnType;
import hopara.dataset.datasource.DataSource;
import hopara.dataset.view.View;

public class PositionViewTest {

    View view;
    PositionTable positionTable;

    @BeforeEach
    public void setup() {
        view = new View("my_ds", "my_view");
        view.addColumn(new Column("id", ColumnType.INTEGER));
        view.addColumn(new Column("name", ColumnType.STRING));

        positionTable = new PositionTable("my_ds", "my_view");
    }

    @Test
    public void shouldnt_create_if_has_no_primary_key() {
        var positionView = new PositionView(view, positionTable);
        assertFalse(positionView.shouldCreate());
    }

    @Test
    public void shouldnt_create_if_ends_with_pos() {
        view.setDataSourceName(DataSource.DEFAULT_NAME);
        view.setName("_pos");

        var positionView = new PositionView(view, positionTable);
        assertFalse(positionView.shouldCreate());
    }

    @Test
    public void should_create_if_has_primary_key() {
        view.setPrimaryKeyName("id");

        var positionView = new PositionView(view, positionTable);
        assertTrue(positionView.shouldCreate());
    }

    @Test
    public void should_create_if_is_entity_view() {
        var entityView = new View("hopara", "_my_view");
        entityView.setPrimaryKeyName("id");

        var positionView = new PositionView(entityView, positionTable);
        assertTrue(positionView.shouldCreate());
    }
}
