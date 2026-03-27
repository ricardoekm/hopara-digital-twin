package hopara.dataset.row.converter.postgres;

import java.util.List;

import hopara.dataset.column.TypeHint;
import hopara.dataset.row.Geometry;
import hopara.dataset.row.converter.GeometryConverter;
import net.postgis.jdbc.PGgeometry;

public class PostgresGeometryConverter extends GeometryConverter {    

    @SuppressWarnings({ "unchecked", "rawtypes" })
    public String getPolygonWkt(List coordinates) {
        if ( !(coordinates instanceof List) ) {
            throw new IllegalArgumentException("Geometry coordinates should be an array: " + coordinates);
        } 

        if ( coordinates.size() == 0 ) {
            return "POLYGON EMPTY";
        }

        if ( !(coordinates.get(0) instanceof List) || !(coordinates.get(coordinates.size()-1) instanceof List) ) {
            throw new IllegalArgumentException("Geometry coordinate should be a pair of arrays: " + coordinates);
        } 
        
        return String.format("POLYGON((%s))", String.join(",", getTextCoordinates(coordinates)));
    }

    @SuppressWarnings({ "unchecked", "rawtypes" })
    public String getLineWkt(List coordinates) {        
        return String.format("LINESTRING(%s)", String.join(",", getTextCoordinates(coordinates)));
    }

    @SuppressWarnings({ "unchecked", "rawtypes" })
    public String getPointWkt(List coordinates) {        
        return String.format("POINT(%s)", String.join(",", getTextCoordinates(coordinates)));
    }

    private Boolean isLine(List<List<Number>> coordinates) {
        if ( coordinates.size() <= 1 ) {
            return false;
        }

        return !coordinates.get(0).equals(coordinates.get(coordinates.size() - 1));
    }
    
    @SuppressWarnings("unchecked")
    public Object toDatabaseFormat(Object coordinates, TypeHint typeHint) {
        if ( coordinates != null  && coordinates instanceof List ) { 
            var typedCoordinates = (List<List<Number>>)coordinates;           
            if ( TypeHint.LINE.equals(typeHint) || isLine(typedCoordinates) ) {
                return getLineWkt(typedCoordinates);
            }
            else if ( TypeHint.POINT.equals(typeHint) || typedCoordinates.size() == 1 ) {
                return getPointWkt(typedCoordinates);
            } 

            return getPolygonWkt(typedCoordinates);
        }

        return coordinates;
    }
    
    public Object fromDatabaseFormat(Object value) {
        var geometry = new Geometry();
        
        var pgGeometry = (PGgeometry)value;
        if ( pgGeometry != null ) {
            var pgGeometryInstance = pgGeometry.getGeometry();
            for (int i = 0; i < pgGeometryInstance.numPoints(); i++)
            {
                var pgPoint = pgGeometryInstance.getPoint(i);
                if ( pgPoint.getDimension() == 3 ) {
                    geometry.add(pgPoint.x,pgPoint.y,pgPoint.z);
                }
                else {
                    geometry.add(pgPoint.x,pgPoint.y);
                }
            }            
            
            return geometry;
        }
        
        return value;
    }

}
