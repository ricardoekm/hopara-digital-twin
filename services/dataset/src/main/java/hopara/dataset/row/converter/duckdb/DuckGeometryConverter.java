package hopara.dataset.row.converter.duckdb;

import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.io.ParseException;
import org.locationtech.jts.io.WKTReader;

import hopara.dataset.row.converter.postgres.PostgresGeometryConverter;

public class DuckGeometryConverter extends PostgresGeometryConverter {
    WKTReader wktReader;
    
    public DuckGeometryConverter() {}
    public DuckGeometryConverter(WKTReader wktReader) {
        this.wktReader = wktReader;
    }
    
    private Geometry readWkt(String wkt) {
        try {
            return wktReader.read(wkt);
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }
    
    public Object fromDatabaseFormat(Object value) {        
        var polygon = new hopara.dataset.row.Geometry();
        
        var wkt = (String)value;
        if ( wkt != null ) {
            Geometry geometry = readWkt(wkt);
            for ( var coordinate : geometry.getCoordinates() ) {
                polygon.add(coordinate.x,coordinate.y);

            }                               
            
            return polygon;
        }
        
        return value;
    }
}
