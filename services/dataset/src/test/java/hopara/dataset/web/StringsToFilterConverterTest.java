package hopara.dataset.web;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

import hopara.dataset.filter.Operator;
import hopara.dataset.web.request.StringsToFiltersConverter;

public class StringsToFilterConverterTest {

    @Test
    void test_convert_json_to_filter() {
        var plainFilter1 = "{\"column\":\"date\",\"values\":[1611090000],\"comparisonType\":\"GREATER_EQUALS_THAN\"}";
        var plainFilter2 = "{\"column\":\"date\",\"values\":[1613768400],\"comparisonType\":\"LESS_EQUALS_THAN\"}";
        var plainFilters = new String[]{ plainFilter1, plainFilter2 };
        
        var stringsToFilterConverter = new StringsToFiltersConverter(ObjectMother.getFilterFactory());
        
        var filters = stringsToFilterConverter.convert(plainFilters);
        var iterator = filters.iterator();
        
        var filter1 = iterator.next();
        assertEquals("date", filter1.getColumn());     
        assertEquals(Operator.GREATER_EQUALS_THAN, filter1.getComparisonType());
        assertEquals(1, filter1.getValues().size());
        assertEquals(1611090000, filter1.getValues().get(0));
        
        var filter2 = iterator.next();
        assertEquals("date", filter2.getColumn());     
        assertEquals(Operator.LESS_EQUALS_THAN, filter2.getComparisonType());
        assertEquals(1, filter2.getValues().size());
        assertEquals(1613768400, filter2.getValues().get(0));        
    }
}
