package hopara.dataset.entitytable;

import java.util.ArrayList;

import hopara.dataset.SqlSanitizer;
import hopara.dataset.datasource.DataSource;
import hopara.dataset.view.EditableColumn;
import hopara.dataset.view.View;
import hopara.dataset.view.WriteLevel;
import static hopara.dataset.Format.format;

public class EntityView extends View {
    public EntityView(String name) {
        super(DataSource.DEFAULT_NAME, name);
        setWriteLevel(WriteLevel.INSERT);
        setWriteTableName(name);
        setPrimaryKeyName(EntityTable.ID_COLUMN);

        var editableColumns = new ArrayList<EditableColumn>();
        editableColumns.add(new EditableColumn(EntityTable.NAME_COLUMN));
        setEditableColumns(editableColumns);

        setFilterTables(true);
        setQuery(format("SELECT %s, %s FROM %s ORDER BY id DESC", EntityTable.NAME_COLUMN, EntityTable.ID_COLUMN, SqlSanitizer.cleanString(name)));
    }
}
