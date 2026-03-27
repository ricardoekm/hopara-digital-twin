package hopara.dataset.row.converter.mysql;

import java.util.List;

import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.io.ParseException;
import org.locationtech.jts.io.WKTReader;

import hopara.dataset.column.TypeHint;
import hopara.dataset.row.converter.GeometryConverter;


public class MySqlGeometryConverter extends GeometryConverter {

    WKTReader wktReader;
    
    public MySqlGeometryConverter() {}
    public MySqlGeometryConverter(WKTReader wktReader) {
        this.wktReader = wktReader;
    }
    
    @SuppressWarnings("unchecked")
    public Object toDatabaseFormat(Object coordinates, TypeHint typeHint) {
        if ( coordinates != null  && coordinates instanceof List ) {     
            return getPolygonWkt((List<List<Number>>)coordinates);
        }

        return coordinates;
    }

    @SuppressWarnings("rawtypes")
    public String getPolygonWkt(List coordinates) {
        return String.format("POLYGON((%s))", getTextCoordinatesAsString(coordinates));
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
