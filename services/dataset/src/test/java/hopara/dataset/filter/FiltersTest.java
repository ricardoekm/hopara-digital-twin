package hopara.dataset.filter;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.ArrayList;

import org.junit.jupiter.api.Test;

public class FiltersTest {

	@Test
	public void dont_add_duplicate_filters() {
		var filters = new Filters();
		filters.add(new Filter("coluna"));
		filters.add(new Filter("coluna"));
		filters.add(new Filter("otaColuna"));

		assertEquals(2, filters.size());
	}
	
	@Test
    public void append_filters() {
	    var filters1 = new Filters();
	    filters1.add(new Filter("coluna"));
	    
	    var filters2 = new Filters();
	    filters2.add(new Filter("otaColuna"));
	    
	    var appendedFilters = filters1.append(filters2);
	    assertEquals(2, appendedFilters.size());
	}

    @Test
    public void delete() {
	    var filters = new Filters();
	    filters.add(new Filter("coluna"));
	    filters.add(new Filter("otaColuna"));
	    
	    filters.delete("otaColuna");
	    assertEquals(1, filters.size());
        assertEquals("coluna", filters.iterator().next().getColumn());
	}
	
	@Test
	public void first_filters_are_kept() {
		var filters = new Filters();
		
		var values1 = new ArrayList<Object>();
		values1.add("Camargo");
		filters.add(new Filter("coluna", values1));
		
		var values2 = new ArrayList<Object>();
		values2.add("Richard");
		filters.add(new Filter("coluna", values2));

		assertEquals(1, filters.size());
		
		var firstFilter = filters.iterator().next();
		assertEquals(values1, firstFilter.getValues());
	}
}
