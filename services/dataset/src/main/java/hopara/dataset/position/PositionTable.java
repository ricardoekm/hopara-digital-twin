package hopara.dataset.position;

import hopara.dataset.column.Column;
import hopara.dataset.column.ColumnType;
import hopara.dataset.column.Columns;
import hopara.dataset.datasource.DataSource;
import hopara.dataset.table.Table;

public class PositionTable extends Table {
    private static final String TABLE_NAME_SUFFIX = "pos";

    public Column getPrimaryKeyColumn() {
        return new Column(PositionColumns.PRIMARY_KEY_COLUMN_NAME, ColumnType.STRING, true);
    }

    private Columns getPositionColumns() {
        var positionColumns = new Columns();
        positionColumns.add(new Column(PositionColumns.POINT_2D_COLUMN_NAME, ColumnType.GEOMETRY));
        positionColumns.add(new Column(PositionColumns.POINT_3D_COLUMN_NAME, ColumnType.GEOMETRY));
        positionColumns.add(new Column(PositionColumns.LINE_COLUMN_NAME, ColumnType.GEOMETRY));
        positionColumns.add(new Column(PositionColumns.RECTANGLE_COLUMN_NAME, ColumnType.GEOMETRY));
        positionColumns.add(new Column(PositionColumns.POLYGON_COLUMN_NAME, ColumnType.GEOMETRY));
        return positionColumns;
    }

    private Column getFloorColumn() {
        return new Column(PositionColumns.FLOOR_COLUMN_NAME, ColumnType.STRING);
    }

    private Columns getMetadataColumns() {
        var metadataColumns = new Columns();
        metadataColumns.add(new Column(PositionColumns.SCOPE_COLUMN_NAME, ColumnType.STRING));
        metadataColumns.add(new Column(PositionColumns.TENANT_COLUMN_NAME, ColumnType.STRING));
        return metadataColumns;
    }

    private Columns getAppearanceColumns() {
        var appearanceColumns = new Columns();
        appearanceColumns.add(new Column(PositionColumns.SIZE, ColumnType.INTEGER));
        appearanceColumns.add(new Column(PositionColumns.SIZE_REFERENCE_ZOOM, ColumnType.DECIMAL));
        appearanceColumns.add(new Column(PositionColumns.SCALE, ColumnType.INTEGER));
        appearanceColumns.add(new Column(PositionColumns.COLOR, ColumnType.STRING));
        appearanceColumns.add(new Column(PositionColumns.VIEW, ColumnType.INTEGER));
        return appearanceColumns;
    }

    private Column getZIndexColumn() {
        return new Column(PositionColumns.Z_INDEX, ColumnType.INTEGER, "0");
    }

    public PositionTable(String dataSourceName, String name) {
        super(DataSource.DEFAULT_NAME, name + "_" + dataSourceName + "_" + TABLE_NAME_SUFFIX);
        addColumn(getPrimaryKeyColumn());
        addColumns(getPositionColumns());
        addColumn(getFloorColumn());
        addColumns(getMetadataColumns());
        addColumns(getAppearanceColumns());
        addColumn(getZIndexColumn());
    }
}
