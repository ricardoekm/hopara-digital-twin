package hopara.dataset.web;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

import hopara.dataset.web.request.StringToFiltersConverter;

public class StringToFiltersConverterTest {
	
	@Test
	void convert_list() {
		var converter = new StringToFiltersConverter(ObjectMother.getFilterFactory());
		var filterSource = "[{ \"column\": \"name\", \"values\":[\"ricardo\"] },\n"
						 + " { \"column\": \"age\", \"values\":[10] }]";
		
		var filters = converter.convert(filterSource);
		
		assertEquals(2, filters.size());
	}
	
	@Test
	void convert_value() {
		var converter = new StringToFiltersConverter(ObjectMother.getFilterFactory());
		var filterSource = "{ \"column\": \"name\", \"values\":[\"ricardo\"] }";
		
		var filters = converter.convert(filterSource);
		
		assertEquals(1, filters.size());
	}

	@Test
	void convert_gzip_value() {
		var converter = new StringToFiltersConverter(ObjectMother.getFilterFactory());
		var filterSource = "{ \"column\": \"name\"," +
						      "\"compressedValues\": \"H4sIAAAAAAAAA4tWcnRyVooFALF/4GIHAAAA\" }";
		
		var filters = converter.convert(filterSource);		
		assertEquals(1, filters.size());

		var filter = filters.get("name");
		assertEquals(1, filter.getValues().size());
		assertEquals("ABC", filter.getValues().get(0));
	}
}
