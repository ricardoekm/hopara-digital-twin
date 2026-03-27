package hopara.dataset.test;

import java.math.RoundingMode;
import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class Assert {
    public static void assertNumberEquals(Object a, Object b) {
	    a = new BigDecimal(a.toString()).setScale(2, RoundingMode.DOWN);
        b = new BigDecimal(b.toString()).setScale(2, RoundingMode.DOWN);
	    
	    assertEquals(a, b);
	}
}
