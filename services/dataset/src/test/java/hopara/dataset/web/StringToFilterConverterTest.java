package hopara.dataset.web;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

import hopara.dataset.filter.Operator;
import hopara.dataset.filter.Filters;
import hopara.dataset.row.read.LogicalOperator;
import hopara.dataset.web.request.StringToFiltersConverter;

public class StringToFilterConverterTest {

    @Test
    void convert_intersect_filter() {
        var intersectFilter = "{\"column\":\"bounds\",\"values\":[[-71.18266883934194,42.286829591879396]],\"comparisonType\":\"INTERSECTS\", \"logicalOperator\":\"OR\"}";
        
        var stringToFilterConverter = new StringToFiltersConverter(ObjectMother.getFilterFactory());
        Filters filters = stringToFilterConverter.convert(intersectFilter);

        var filter = filters.iterator().next();
        assertEquals("bounds", filter.getColumn());
        assertEquals(Operator.INTERSECTS, filter.getComparisonType());
        assertEquals(LogicalOperator.OR, filter.getLogicalOperator());
    }
}
