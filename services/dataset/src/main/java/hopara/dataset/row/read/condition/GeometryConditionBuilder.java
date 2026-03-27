package hopara.dataset.row.read.condition;

import java.util.ArrayList;
import java.util.List;

import hopara.dataset.database.Database;
import hopara.dataset.filter.Operator;
import hopara.dataset.row.converter.GeometryConverter;

public abstract class GeometryConditionBuilder extends BaseConditionBuilder {
    
    protected GeometryConverter polygonConverter;
    
    public GeometryConditionBuilder(GeometryConverter polygonConverter,Database database) {
        super(database);
        this.polygonConverter = polygonConverter;
    }

    @Override
    @SuppressWarnings({"rawtypes"})
    protected Object castValue(Object value, Operator comparisonType) {
        return super.castValue(polygonConverter.getPolygonWkt((List)value), comparisonType);
    }

    @Override
    public List<Operator> getSupportedComparions() {
        var comparisonTypes = new ArrayList<Operator>();
        comparisonTypes.add(Operator.INTERSECTS);
        // For null operations
        comparisonTypes.add(Operator.EQUALS);
        return comparisonTypes;
    }
}
