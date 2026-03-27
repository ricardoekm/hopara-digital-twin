package hopara.dataset.row.read;

import java.util.List;

import hopara.dataset.SqlSanitizer;
import hopara.dataset.database.Database;
import hopara.dataset.filter.Operator;

import java.util.ArrayList;

public class DistanceSort implements Sort {
    List<String> columns = new ArrayList<String>();
    List<Number> coordinates = new ArrayList<Number>();	

    public DistanceSort() { }

    public DistanceSort(List<String> columns, List<Number> coordinates) {
        this.columns = columns;
        this.coordinates = coordinates;
    }

    public List<String> getColumns() {
        return columns;
    }

    public List<Number> getCoordinates() {
        return coordinates;
    }

    private boolean areAllColumnsEqual() {
        return columns.stream().allMatch( column -> column.equals(columns.get(0)) );
    }

    public String getColumnClause(Database database) {
        if ( columns.size() == 0 ) {
            throw new IllegalArgumentException("Columns must not be empty");
        }

        if ( columns.size() == 1 || areAllColumnsEqual() ) {
            return columns.get(0);
        }

        return database.getSqlOperator(Operator.MAKE_POINT) + "(" + SqlSanitizer.cleanString(columns.get(0)) + "," + SqlSanitizer.cleanString(columns.get(1)) + ")";
    }

    public Object getCoordinatesClause(Database database) {
        if ( coordinates.size() == 0 ) {
            throw new IllegalArgumentException("Coordinates must not be empty");
        }

        var coordinatesClause = database.getSqlOperator(Operator.MAKE_POINT) + "(" + coordinates.get(0) + "," + coordinates.get(1) + ")";
        if ( database.supportSrid() ) {
            return "ST_SetSRID(" + coordinatesClause + ", ST_SRID(" + getColumnClause(database) + "))";
        }
        
        return coordinatesClause;
    }

    public String getClause(Database database) {
        return "ST_Distance(" + getColumnClause(database) + "," + getCoordinatesClause(database) + ")";
    }
}
