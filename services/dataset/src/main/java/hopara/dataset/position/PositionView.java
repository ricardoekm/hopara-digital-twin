package hopara.dataset.position;

import hopara.dataset.datasource.DataSource;
import hopara.dataset.view.View;
import hopara.dataset.view.ViewKey;

import static hopara.dataset.Format.format;

public class PositionView extends View {
    private static final String POSITION_VIEW_SUFFIX = "pos";

    View view;
    String positionTableName;

    public static Boolean isPositionView(ViewKey viewKey) {
        return viewKey.getDataSourceName().equals(DataSource.DEFAULT_NAME) &&
               viewKey.getName().endsWith(POSITION_VIEW_SUFFIX);
    }

    private String getQuery(PositionTable positionTable) {
        return format("SELECT %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s FROM %s", 
                      PositionColumns.PRIMARY_KEY_COLUMN_NAME,
                      PositionColumns.POINT_2D_COLUMN_NAME,
                      PositionColumns.POINT_3D_COLUMN_NAME,
                      PositionColumns.LINE_COLUMN_NAME,
                      PositionColumns.RECTANGLE_COLUMN_NAME,
                      PositionColumns.POLYGON_COLUMN_NAME,
                      PositionColumns.FLOOR_COLUMN_NAME,
                      PositionColumns.SIZE,
                      PositionColumns.SIZE_REFERENCE_ZOOM,
                      PositionColumns.COLOR,
                      PositionColumns.SCALE,
                      PositionColumns.VIEW,
                      PositionColumns.Z_INDEX,
                      positionTable.getSqlName());
    }

    public PositionView(View view, PositionTable positionTable) {
        super(DataSource.DEFAULT_NAME, view.getName() + "_" + view.getDataSourceName() + "_"  + POSITION_VIEW_SUFFIX);
        setDatabaseClass(view.getDatabaseClass());
        setQuery(getQuery(positionTable));
        setWriteTableName(positionTable.getSqlName());
        setPrimaryKeyName(PositionColumns.PRIMARY_KEY_COLUMN_NAME);
        setUpsert(true);
        setFilterTables(true); // required to filter hopara scope
        this.view = view;
    }

    public Boolean shouldCreate() {
      if ( !view.hasPrimaryKey() ) {
        return false;
      }

      if ( view.getDataSourceName().equals(DataSource.DEFAULT_NAME) ) {
        return !view.getName().endsWith(POSITION_VIEW_SUFFIX) && !view.getName().startsWith("test_");
      }

      return true;
    }
}
