package hopara.dataset.time;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;

public class DateParserTest {

	@Test
	void parse_eu_entrego_format() {
		assertNotNull(DateParser.parse("2020-11-27 00:00:00Z"));
	}
	
	@Test
	void parse_front_format() {
		assertNotNull(DateParser.parse("2020-10-27T00:00:00Z"));
		assertNotNull(DateParser.parse("2020-10"));
	}
	
	@Test
	void parse_python_format() {
        assertNotNull(DateParser.parse("1986-01-07T15:02:00")); 
	}

	@Test
	void parse_python_format_with_ms() {
        assertNotNull(DateParser.parse("2022-02-21T21:03:23.000")); 
		assertNotNull(DateParser.parse("2022-09-30T22:35:38.742179")); 
	}
}
