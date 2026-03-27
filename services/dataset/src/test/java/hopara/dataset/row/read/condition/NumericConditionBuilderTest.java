package hopara.dataset.row.read.condition;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Map;

import org.junit.jupiter.api.Test;

import hopara.dataset.database.Postgres;
import hopara.dataset.filter.Filter;

public class NumericConditionBuilderTest {

    @Test
    void cast_string_to_integer() {
        var numericConditionBuilder = new NumericConditionBuilder(new Postgres());
        var filter = new Filter("idade","40");
        
        Map<String, Object> params = numericConditionBuilder.getParams(filter);
        assertEquals(40, params.get("filterValue_EQUALS_idade_0"));
    }
    
    @Test
    void cast_string_to_double() {
        var numericConditionBuilder = new NumericConditionBuilder(new Postgres());
        var filter = new Filter("idade","40.20");
        
        Map<String, Object> params = numericConditionBuilder.getParams(filter);
        assertEquals(40.20d, params.get("filterValue_EQUALS_idade_0"));
    }
}
