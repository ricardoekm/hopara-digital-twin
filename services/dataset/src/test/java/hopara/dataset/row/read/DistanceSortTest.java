package hopara.dataset.row.read;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.ArrayList;

import org.junit.jupiter.api.Test;

import hopara.dataset.database.Postgres;

public class DistanceSortTest {
    @Test
    public void get_column_clause_returns_column_if_theres_only_one_column() {
        var columns = new ArrayList<String>();
        columns.add("location");

        var distanceSort = new DistanceSort(columns,new ArrayList<Number>());
        assertEquals("location", distanceSort.getColumnClause(new Postgres()));
    }

    @Test
    public void get_column_clause_returns_column_if_columns_are_the_same() {
        var columns = new ArrayList<String>();
        columns.add("location");
        columns.add("location");

        var distanceSort = new DistanceSort(columns,new ArrayList<Number>());
        assertEquals("location", distanceSort.getColumnClause(new Postgres()));
    }

    @Test
    public void get_column_clause_returns_make_point_if_there_re_multiple_columns() {
        var columns = new ArrayList<String>();
        columns.add("lat");
        columns.add("long");

        var distanceSort = new DistanceSort(columns,new ArrayList<Number>());
        assertEquals("ST_MakePoint(lat,long)", distanceSort.getColumnClause(new Postgres()));
    }

    @Test
    public void get_coordinates_clause() {
        var coordinates = new ArrayList<Number>();
        coordinates.add(1);
        coordinates.add(1);

        var columns = new ArrayList<String>();
        columns.add("location");

        var distanceSort = new DistanceSort(columns,coordinates);
        assertEquals("ST_SetSRID(ST_MakePoint(1,1), ST_SRID(location))", distanceSort.getCoordinatesClause(new Postgres()));
    }
}
