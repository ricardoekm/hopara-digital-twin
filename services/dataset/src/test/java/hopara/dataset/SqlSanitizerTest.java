package hopara.dataset;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

public class SqlSanitizerTest {

	@Test
	void clean_string_only_allow_char_digits__and_underscore() {
		var string = "_A!?#()B_";
		
		assertEquals( "_AB_", SqlSanitizer.cleanString(string));
	}

	@Test
	void remove_leading_numbers() {
		var string = "123_AB_";
		
		assertEquals( "_AB_", SqlSanitizer.cleanString(string));
	}

		@Test
	void keep_numbers_after_underscore() {
		var string = "_3D";
		
		assertEquals( "_3D", SqlSanitizer.cleanString(string));
	}

	@Test
	void basic_clean_string_avoid_basic_sql_injetion() {
		var string = "\"_AB_;";
		
		assertEquals( "_AB_", SqlSanitizer.basicCleanString(string));
	}
}
