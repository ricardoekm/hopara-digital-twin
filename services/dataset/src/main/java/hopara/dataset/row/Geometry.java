package hopara.dataset.row;

import java.util.ArrayList;
import java.util.List;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.Envelope;
import org.locationtech.jts.geom.GeometryFactory;

public class Geometry extends ArrayList<List<Number>>
{
    /**
     * 
     */
    private static final long serialVersionUID = 1L;

    public Geometry() {}

    public Geometry(Number x, Number y) {
        add(x, y);
    }

    public void add(Number x, Number y) {
        var coordinate = new ArrayList<Number>();
        coordinate.add(x);
        coordinate.add(y);
        
        super.add(coordinate);
    }

    public void add(Number x, Number y, Number z) {
        var coordinate = new ArrayList<Number>();
        coordinate.add(x);
        coordinate.add(y);
        coordinate.add(z);
        
        super.add(coordinate);
    }

    private boolean areCoordinatesEquals(List<Number> coordinate1, List<Number> coordinate2) {
        return coordinate1.get(0).equals(coordinate2.get(0)) && coordinate1.get(1).equals(coordinate2.get(1));
    }
    
    // Convenience fix, deck works with unclosed ring on bitmap layer
    public void closeRing() {
        var firstCoordinate = (List<Number>)this.get(0);
        var lastCoordinate = (List<Number>)this.get(this.size()-1);
        if ( !areCoordinatesEquals(firstCoordinate,lastCoordinate) ) {
            this.add(firstCoordinate);
        }
    }

    public List<Coordinate> getCoordinates() {
        var coordinates = new ArrayList<Coordinate>();

        for ( var coordinate : this ) {
            coordinates.add(new Coordinate(coordinate.get(0).doubleValue(),coordinate.get(1).doubleValue()));
        }

        return coordinates;
    }

    private org.locationtech.jts.geom.Polygon toJts() {
        var geometryFactory = new GeometryFactory();
        return geometryFactory.createPolygon(getCoordinates().toArray(new Coordinate[getCoordinates().size()]));
    }

    private static Geometry fromJtsGeometry(org.locationtech.jts.geom.Geometry jtsGeometry) {
        var geometry = new Geometry();
        for ( var coordinate : jtsGeometry.getCoordinates() ) {
            geometry.add(coordinate.getX(), coordinate.getY());
        }
        return geometry;
    }

    public List<Geometry> split() {
        var jtsPolygon = toJts();
        var maxX = jtsPolygon.getEnvelopeInternal().getMaxX();
        var minX = jtsPolygon.getEnvelopeInternal().getMinX();
        var minY = jtsPolygon.getEnvelopeInternal().getMinY();
        var maxY = jtsPolygon.getEnvelopeInternal().getMaxY();

        var midX = minX + ((maxX - minX) / 2.0);

        var leftBoundaries = new Envelope(minX, midX, minY, maxY);
        var rightBoundaries = new Envelope(midX, maxX, minY, maxY);

        var geometryFactory = new GeometryFactory();
        var leftPolygon = geometryFactory.toGeometry(leftBoundaries).intersection(jtsPolygon);
        var rightPolygon = geometryFactory.toGeometry(rightBoundaries).intersection(jtsPolygon);

        var splitPolygons = new ArrayList<Geometry>();
        splitPolygons.add(Geometry.fromJtsGeometry(leftPolygon));
        splitPolygons.add(Geometry.fromJtsGeometry(rightPolygon));
        return splitPolygons;
    }  

    
}
