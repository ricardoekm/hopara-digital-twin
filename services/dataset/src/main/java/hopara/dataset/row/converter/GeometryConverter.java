package hopara.dataset.row.converter;

import java.util.ArrayList;
import java.util.List;

public abstract class GeometryConverter implements Converter {
    private String coordinateToString(List<Number> coordinate) {
        var stringCoordinates = new ArrayList<String>();
        for ( var coordinateNumber : coordinate ) {
            stringCoordinates.add(coordinateNumber.toString());

        }
        return String.join(" ", stringCoordinates);
    }
    
    protected List<String> getTextCoordinates(List<List<Number>> coordinates) {
        var textCoordinates = new ArrayList<String>();
         
        for ( var coordinate : coordinates ) {
            textCoordinates.add(coordinateToString(coordinate));
        }
        
        return textCoordinates;
    }
    
    private boolean areCoordinatesEquals(List<Number> coordinate1, List<Number> coordinate2) {
        return coordinate1.get(0).equals(coordinate2.get(0)) && coordinate1.get(1).equals(coordinate2.get(1));
    }
    
    // Convenience fix, deck works with unclosed ring on bitmap layer
    @SuppressWarnings({ "unchecked", "rawtypes" })
    protected void closeRing(List coordinates) {
        var firstCoordinate = (List<Number>)coordinates.get(0);
        var lastCoordinate = (List<Number>)coordinates.get(coordinates.size()-1);

        if ( !(firstCoordinate.get(0) instanceof Number)  || 
             !(firstCoordinate.get(1) instanceof Number)  || 
             !(lastCoordinate.get(0) instanceof Number) ||
             !(lastCoordinate.get(1) instanceof Number) ) {
            throw new IllegalArgumentException("Coordinates should be number: " + firstCoordinate); 
        }

        if ( !areCoordinatesEquals(firstCoordinate,lastCoordinate) ) {
            coordinates.add(firstCoordinate);
        }
    }
    
    @SuppressWarnings({ "unchecked", "rawtypes" })
    protected String getTextCoordinatesAsString(List coordinates) {
        return String.join(",", getTextCoordinates(coordinates));
    }
    
    @SuppressWarnings("rawtypes")
    public abstract String getPolygonWkt(List coordinates);
}
