package hopara.dataset.table;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;

import hopara.dataset.column.Column;
import hopara.dataset.column.ColumnType;
import hopara.dataset.row.Geometry;
import hopara.dataset.row.RowIntegrationTest;
import hopara.dataset.view.View;

public class ColumnTypeTest extends RowIntegrationTest {
	
	@Override
	protected Table getTable() {
		var table = new Table();
		table.setName("column_type_test");
		
	    var idColumn = new Column("_id", ColumnType.AUTO_INCREMENT);
		var stringColumn = new Column("name", ColumnType.STRING);
		var intColumn = new Column("age", ColumnType.INTEGER);
		var objectColumn = new Column("address", ColumnType.JSON);
		var arrayColumn = new Column("cars", ColumnType.STRING_ARRAY);
		var geometryColumn = new Column("house", ColumnType.GEOMETRY);
        var booleanColumn = new Column("happy", ColumnType.BOOLEAN);

	    table.addColumn(idColumn);
		table.addColumn(stringColumn);
		table.addColumn(intColumn);
		table.addColumn(objectColumn);
		table.addColumn(arrayColumn);
		table.addColumn(geometryColumn);
		table.addColumn(booleanColumn);
				
		return table;
	}

	@Override
	protected View getView() {
		var view = new View(getTestDataSource(),"column_type_test_view");
		view.setDatabaseClass(database.getDbClass());
		view.setQuery("SELECT * FROM column_type_test");
		return view;
	}
	
	public Object getField(Object object, String fieldName) throws NoSuchFieldException, SecurityException, IllegalArgumentException, IllegalAccessException {
		var field = object.getClass().getDeclaredField(fieldName);    
		field.setAccessible(true);
		return field.get(object);
	}

	
	@Test
	public void simple_types() throws Exception {	
		var galo = new HashMap<String,Object>();
		galo.put("name", "Galo");
		galo.put("age", 10);
		galo.put("happy", true);
		saveRow(galo);
		
		var rows = findRows();
		assertEquals(1,rows.size());

		var row = rows.get(0);
		assertEquals("Galo", row.get("name"));
	    assertEquals(10, row.get("age"));
	    assertEquals(true, row.get("happy"));
	}
	
	@Test
	void ignores_array_values_on_simple_columns() {
		var array = new ArrayList<String>();
		array.add("Galo");
		array.add("Bradock");
		
		var values = new HashMap<String,Object>();
		values.put("name", array);
		
		var savedRow = saveRow(values);
		assertNull(savedRow);
	}
	
	@Test
	@SuppressWarnings("unchecked")
	public void json_type() throws Exception {
		var address = new HashMap<String,Object>();
		address.put("number", 15);
		address.put("street", "My Street");
	
		var galo = new HashMap<String,Object>();
		galo.put("address", address);
		saveRow(galo);
		
		var row = findRows().get(0);		
		var retrievedAddress = (Map<String,Object>)row.get("address");
		assertTrue(retrievedAddress.containsKey("number"));
		assertTrue(retrievedAddress.containsValue(15));
		
		assertTrue(retrievedAddress.containsKey("street"));
		assertTrue(retrievedAddress.containsValue("My Street"));
	}
	
	@Test
	@SuppressWarnings("unchecked")
	public void array_as_json_type() throws Exception {
		var cars = new ArrayList<String>();
		cars.add("address 1");
		cars.add("address 2");
	
		var galo = new HashMap<String,Object>();
		galo.put("address", cars);
		saveRow(galo);
		
		var row = findRows().get(0);		
		var retrievedCars= (List<String>)row.get("address");
		assertTrue(retrievedCars.contains("address 1"));
		assertTrue(retrievedCars.contains("address 2"));
	}
	
	@Test
	@SuppressWarnings("unchecked")
	public void array_type() throws Exception {	
		var cars = new ArrayList<String>();
		cars.add("suzuki");
		cars.add("wrangler");
	
		var galo = new HashMap<String,Object>();
		galo.put("cars", cars);
		saveRow(galo);
		
		var row = findRows().get(0);		
		var retrievedCars= (List<String>)row.get("cars");
		assertTrue(retrievedCars.contains("suzuki"));
		assertTrue(retrievedCars.contains("wrangler"));
	}
	
	@Test
    public void geometry_type() throws Exception {	    
        var house = new Geometry();
        house.add(0d,0d,0d);
        house.add(1d,0d,0d);
        house.add(1d,1d,0d);
        house.add(0d,1d,0d);
        house.add(0d,0d,0d);
        
        var galo = new HashMap<String,Object>();
        galo.put("house", house);
        saveRow(galo);
        
        var row = findRows().get(0);        
        var retrievedHouse = row.get("house");
        
        assertEquals(house,retrievedHouse);
        
        var newHouse = new Geometry();
        newHouse.add(1d,1d,0d);
        newHouse.add(2d,1d,0d);
        newHouse.add(2d,2d,0d);
        newHouse.add(1d,2d,0d);
        newHouse.add(1d,1d,0d);
        
        galo.put("house", newHouse);

        var updatedRow = updateRow((Number)row.get("_id"), galo);
        var updatedHouse = updatedRow.get("house");

        assertEquals(newHouse,updatedHouse);
    }
}
