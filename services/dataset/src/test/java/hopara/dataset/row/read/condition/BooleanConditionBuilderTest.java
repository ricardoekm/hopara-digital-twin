package hopara.dataset.row.read.condition;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Map;

import org.junit.jupiter.api.Test;

import hopara.dataset.database.Postgres;
import hopara.dataset.filter.Filter;

public class BooleanConditionBuilderTest {

    @Test
    void cast_string_to_boolean() {
        var booleanConditionBuilder = new BooleanConditionBuilder(new Postgres());
        var filter = new Filter("legal","true");
        
        Map<String, Object> params = booleanConditionBuilder.getParams(filter);
        assertEquals(true, params.get("filterValue_EQUALS_legal_0"));
    }
}
