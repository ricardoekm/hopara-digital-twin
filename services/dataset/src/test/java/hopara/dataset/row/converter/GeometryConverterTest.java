package hopara.dataset.row.converter;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

import hopara.dataset.column.TypeHint;
import hopara.dataset.row.Geometry;
import hopara.dataset.row.converter.postgres.PostgresGeometryConverter;

public class GeometryConverterTest {
    
    @Test
    void convert_to_postgres_coordinate_format() {
        var polygon = new Geometry();
        polygon.add(0,0);
        polygon.add(1,0);
        polygon.add(1,1);
        polygon.add(0,1);
        polygon.add(0,0);
        
        var converter = new PostgresGeometryConverter();
        assertEquals("POLYGON((0 0,1 0,1 1,0 1,0 0))", converter.toDatabaseFormat(polygon, TypeHint.NONE));
    }

    @Test
    void convert_to_postgres_line_coordinate_format() {
        var linestring = new Geometry();
        linestring.add(0,0);
        linestring.add(1,0);
        
        var converter = new PostgresGeometryConverter();
        assertEquals("LINESTRING(0 0,1 0)", converter.toDatabaseFormat(linestring, TypeHint.LINE));
    }

    @Test
    void convert_to_postgres_point_coordinate_format() {
        var point = new Geometry();
        point.add(1,1);
        
        var converter = new PostgresGeometryConverter();
        assertEquals("POINT(1 1)", converter.toDatabaseFormat(point, TypeHint.NONE));
    }
    
    @Test
    void convert_to_postgres_point_coordinate_format_with_3_dimensions() {
        var point = new Geometry();
        point.add(1,1, 1);
        
        var converter = new PostgresGeometryConverter();
        assertEquals("POINT(1 1 1)", converter.toDatabaseFormat(point, TypeHint.NONE));
    }

    @Test
    void convert_to_postgres_point_coordinate_format_with_2_dimensions() {
        var point = new Geometry();
        point.add(1,1);
        
        var converter = new PostgresGeometryConverter();
        assertEquals("POINT(1 1)", converter.toDatabaseFormat(point, TypeHint.NONE));
    }
}
