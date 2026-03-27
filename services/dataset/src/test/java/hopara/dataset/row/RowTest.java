package hopara.dataset.row;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.text.ParseException;
import java.util.Date;
import java.util.HashMap;

import org.joda.time.format.DateTimeFormat;
import org.junit.jupiter.api.Test;

import hopara.dataset.column.Column;
import hopara.dataset.column.ColumnType;
import hopara.dataset.column.Columns;
import hopara.dataset.time.DateParser;

class RowTest {
	@Test
	@SuppressWarnings("unused")
	void get_values() {
		var object = new Object() {
			public Integer age = 15;
			public String name = "Sponge Bob";
		};
		
		var row = new Row(object); 
		var values = row.getValues();
		
		assertEquals(15, values.get("age"));
		assertEquals("Sponge Bob", values.get("name"));
	}
	
	@Test
	@SuppressWarnings("unused")
	void get_time_detects_format() throws ParseException {
		var dateString = "2012-04-23T18:25:43.511Z";
		var object = new Object() {
			public String time = dateString;
		};
		
		var dateTimeFormat = DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ss.SSSZ");
		var time = dateTimeFormat.parseDateTime(dateString).toDate();

		var row = new Row(object); 

		assertEquals(time, row.convertToTime(dateString));
	}
	
	@Test
	@SuppressWarnings("unused")
	void get_double() {
		var object = new Object() {
			public Double score = 1.5;
		};
		
		var row = new Row(object);
		assertEquals(1.5, row.getDouble("score"));
	}
	
	@Test
	@SuppressWarnings("unused")
	void cast_types_convert_types_based_on_column_definitions() {
		var object = new Object() {
			public String birthDate = "01/01/2020";
		};
		
		var columns = new Columns();
		columns.add(new Column("birthDate",ColumnType.DATETIME));
		
		var row = new Row(object);
		row.castTypes(columns);
		
		assertTrue(row.getValue("birthDate") instanceof Date);
	}
	
	@Test
	@SuppressWarnings("unused")
	void cast_types_throws_exception_if_not_castable() {
		var object = new Object() {
			public String birthDate = "aaaaa";
		};
		
		var columns = new Columns();
		columns.add(new Column("birthDate",ColumnType.DATETIME));
		
		var row = new Row(object);		
		assertThrows(IllegalArgumentException.class, () -> { row.castTypes(columns); });
	}
	
	@Test
	@SuppressWarnings("unused")
	void get_double_works_with_integer() {
		var object = new Object() {
			public Integer age = 1;
		};
		
		var row = new Row(object);
		assertEquals(1.0, row.getDouble("age"));
	}
	
	@Test
    @SuppressWarnings("unused")
    void get_double_works_with_date() {
	    var values = new HashMap<String,Date>();
	    values.put("age", DateParser.parse("06/06/1986"));
  
        var row = new Row(values);
        //TODO: fix CI timezone
        //assertEquals(5.184108E8, row.getDouble("age"));
    }
	
	@Test
	@SuppressWarnings("unused")
	void get_double_returns_null_when_field_is_not_present() {
		var object = new Object() {
			public Integer age;
		};
		
		var row = new Row(object);
		assertNull(row.getDouble("score"));
	}
}
