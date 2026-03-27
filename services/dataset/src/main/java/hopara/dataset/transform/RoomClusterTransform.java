package hopara.dataset.transform;

import hopara.dataset.SqlSanitizer;
import hopara.dataset.column.Column;
import hopara.dataset.column.ColumnType;
import hopara.dataset.column.Columns;
import static hopara.dataset.Format.format;

public class RoomClusterTransform extends AggregationTransform {

    // The geometry is required for the distribution at the front-end
    private String roomGeometryColumn;
    private String groupColumn;
    private String floorColumn;

    public RoomClusterTransform() {}
    public RoomClusterTransform(String roomGeometryColumn, String groupColumn) {
        setRoomGeometryColumn(roomGeometryColumn);
        setGroupColumn(groupColumn);
    }

    public void setFloorColumn(String floorColumn) {
        this.floorColumn = floorColumn;
    }

    public String getFloorColumn() {
        return floorColumn;
    }

    public void setRoomGeometryColumn(String roomGeometryColumn) {
        this.roomGeometryColumn = SqlSanitizer.cleanString(roomGeometryColumn);
    }

    public String getRoomGeometryColumn() {
        return roomGeometryColumn;
    }

    public void setGroupColumn(String clusterColumn) {
        this.groupColumn = clusterColumn;
    }

    public String getGroupColumn() {
        return groupColumn;
    }

    @Override
    public TransformType getType() {
        return TransformType.ROOM_CLUSTER;
    }

    public Columns getColumns(Columns viewColumns) {
        var columns = this.getAggregationColumns(viewColumns);
        columns.add(new Column("room_coordinates", ColumnType.GEOMETRY));
        columns.add(new Column("room_bounding_box", ColumnType.GEOMETRY));
        columns.add(new Column("item_group", ColumnType.STRING));
        columns.add(new Column("item_count", ColumnType.INTEGER));
        columns.add(new Column("floor", ColumnType.STRING));
        return columns;
    }

    private String getFloorSelect(Columns columns) {
        if ( this.floorColumn == null ) {
            if ( columns.contains("floor") ) {
                return "floor";
            }
            else {
                return "'no-floor'";
            }            
        }

        return this.floorColumn;
    }

    private void validate() {
        if ( this.roomGeometryColumn == null) {
            throw new IllegalArgumentException("Room geometry column not set");
        }

        if ( this.groupColumn == null ) {
            throw new IllegalArgumentException("Group column column not set");
        }
    }

    @Override
    public String getQuery(Columns viewColumns, String baseCteName) {
        validate();

        return format("SELECT %s as room_coordinates, ST_Transform(ST_OrientedEnvelope(ST_Transform(ST_SetSrid(%s,4326),3857)),4326) as room_bounding_box, ST_GeoHash(%s, 15) as _room_id, %s as item_group, %s as floor, count(*) AS item_count, " +  
                      "(row_number() OVER (PARTITION BY ST_GeoHash(%s, 15) ORDER BY count(*) DESC) - 1) AS _index_in_room" +
                       getAggregationSelects(viewColumns) + 
                       " FROM %s" +
                       " GROUP BY 1, 2, 3, 4, 5",
                       roomGeometryColumn, roomGeometryColumn, roomGeometryColumn, groupColumn, this.getFloorSelect(viewColumns), roomGeometryColumn, baseCteName);
    }
}
