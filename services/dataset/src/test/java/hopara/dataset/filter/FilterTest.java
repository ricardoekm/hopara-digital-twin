package hopara.dataset.filter;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

public class FilterTest {

    @Test
    void has_not_null_values() {
        var filter = new Filter("feliz"); 
        assertFalse(filter.hasNotNullValues());
        
        filter.addValue(null);
        assertFalse(filter.hasNotNullValues());

        filter.addValue(true);
        assertTrue(filter.hasNotNullValues());
    }
}
