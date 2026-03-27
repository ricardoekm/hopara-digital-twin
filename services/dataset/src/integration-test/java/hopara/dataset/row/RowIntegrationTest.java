package hopara.dataset.row;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;

import hopara.dataset.IntegrationTest;
import hopara.dataset.column.Column;
import hopara.dataset.column.ColumnType;
import hopara.dataset.column.Columns;
import hopara.dataset.database.Database;
import hopara.dataset.filter.Filter;
import hopara.dataset.filter.Filters;
import hopara.dataset.row.read.ColumnSort;
import hopara.dataset.row.read.DistanceSort;
import hopara.dataset.row.read.Pagination;
import hopara.dataset.row.read.RowReadTableRepository;
import hopara.dataset.row.read.RowReadViewRepository;
import hopara.dataset.row.read.SortOrder;
import hopara.dataset.row.write.RowWriteRepository;
import hopara.dataset.table.Table;
import hopara.dataset.table.TableService;
import hopara.dataset.table.Tables;
import hopara.dataset.transform.NullTransform;
import hopara.dataset.transform.Transform;
import hopara.dataset.view.View;
import hopara.dataset.view.ViewService;
import hopara.dataset.view.Views;

public class RowIntegrationTest extends IntegrationTest {
    @Autowired
    protected TableService tableService;
    
    @Autowired 
    protected RowReadTableRepository rowReadRepository;
    
    @Autowired
    protected RowReadViewRepository rowReadViewRepository;
    
    @Autowired 
    protected RowWriteRepository rowWriteRepository;
    
    @Autowired
    protected ViewService viewService;

	@Autowired
	protected Database database;
    
	protected Columns getPessoasColumns() {
		var columns = new Columns();
		var nomeColumn = new Column("nome",ColumnType.STRING);
		columns.add(nomeColumn);
		
		columns.add(new Column("cidade",ColumnType.STRING));
        columns.add(new Column("_id",ColumnType.AUTO_INCREMENT));
		columns.add(new Column("idade",ColumnType.INTEGER));
		columns.add(new Column("peso", ColumnType.DECIMAL));
		columns.add(new Column("nascimento", ColumnType.DATETIME));
		columns.add(new Column("carros", ColumnType.STRING_ARRAY));
		columns.add(new Column("casa", ColumnType.GEOMETRY));

		return columns;
	}

	protected Table getTable() {
		var table = new Table();
		table.setName("test_pessoas");
		table.getColumns().addAll(getPessoasColumns());
		return table;
	}
	
	// If the table is modified this will get the latest version
	protected Table getSavedTable() {
	    return (Table)tableService.find(getTable().getKey());
	}

	protected View getSavedView() {
	    return (View)viewService.find(getView().getKey());
	}
	
	// To allow test overwrite using multiple tables
	protected Tables getTables() {
		var tables = new Tables();
		tables.add(getTable());
	
		return tables; 
	}
	
	protected View getView() {
		var view = new View(getTestDataSource(),"test_pessoas_view");
		view.setQuery("SELECT * FROM test_pessoas ORDER BY nome");
		view.setDatabaseClass(database.getDbClass());
	    return view;
	}
	
	protected Views getViews() {
	    var views = new Views();
	    
	    if ( getView() != null ) {
	        views.add(getView());    
	    }
	    
        return views;
    }
	
	@BeforeEach
    void saveSources() {    	
		for ( var table : getTables() ) {
		    tableService.delete(table);
			tableService.save(table);
		}
		
		for ( var view : getViews() ) {
            viewService.upsert(view, false);
        }	
    }

	protected Map<String,Object> updateRow(Table table, Row row, Filters filters) {
        var idFilter = new Filter("_id",row.getId());
        idFilter.setOptional(false);
        filters.add(idFilter);

		rowWriteRepository.update(table, row, filters);
		
		var savedRows = findRows();
		if ( savedRows.size() > 0 ) {
			return savedRows.get(0);
		}
		
		return null;
	}

	protected Map<String,Object> updateRow(Row row, Filters filters) {
        return updateRow(getSavedTable(), row, filters);
	}
	
	protected Map<String,Object> updateRow(Number id, Map<String, Object> updateValues) {
		return updateRow(new Row(id, updateValues), new Filters());
	} 

	protected Map<String,Object> updateRow(Number id, Map<String, Object> updateValues, Filters filters) {
		return updateRow(new Row(id, updateValues), filters);
	}
	
	public static Map<String,Object> getAnyValues() {
		var values = new HashMap<String,Object>();
		values.put("nome", "Galo " + Math.random());
		values.put("idade", 34);
		values.put("peso", 82);
		
		return values;
    }
	
	protected List<Map<String,Object>> saveRow(Table table, List<Row> rows) {
		rowWriteRepository.insert(table, rows);
		
		return findRows(table);
	}

	protected List<Map<String,Object>> saveRow(List<Row> rows) {
		rowWriteRepository.insert(getTable(), rows);
		
		return findRows();
	}
	
	protected Map<String,Object> saveRow(Table table, Row row) {
		List<Row> rows = new ArrayList<Row>();
		rows.add(row);
		
		var savedRows = saveRow(table, rows);
		if ( savedRows.size() > 0 ) {
			return savedRows.get(0);
		}
		
		return null;
	}
	
	protected Map<String,Object> saveRow(Row row) {
		return saveRow(getSavedTable(), row);
	}
	
	protected Row getSimpleRow(Map<String,Object> values) {
		return new Row(values);
	}
	
	protected Map<String,Object> saveRow(Map<String,Object> values) {
		return saveRow(getSimpleRow(values));
	}

    protected Map<String,Object> saveRow(Table table, Map<String,Object> values) {
		return saveRow(table, getSimpleRow(values));
	}

	protected List<Map<String,Object>> findRows(Table table) {
		return rowReadRepository.find(table, new NoCacheFilters());
	}


	protected List<Map<String,Object>> findRows(Table table, String sortColumn) {
        var sort = new ColumnSort(sortColumn,SortOrder.ASC);
		return rowReadRepository.find(table, new NoCacheFilters(), null, sort);
	}
	
    protected List<Map<String,Object>> findRows() {
        return rowReadViewRepository.find(getSavedView(), new NullTransform() ,new NoCacheFilters());
    }
    
    protected List<Map<String,Object>> findRows(Pagination pagination) {
        return rowReadViewRepository.find(getSavedView(), new NullTransform(), new NoCacheFilters(), pagination);
    }

    protected List<Map<String,Object>> findRows(DistanceSort distanceSort) {
        return rowReadViewRepository.find(getSavedView(), new NullTransform(), new NoCacheFilters(), new Pagination(50, null), distanceSort);
    }

	protected List<Map<String,Object>> findRows(Transform transform) {
        return rowReadViewRepository.find(getSavedView(), transform, new NoCacheFilters());
    }

	protected List<Map<String,Object>> findRows(Transform transform, Filters filters) {
        return rowReadViewRepository.find(getSavedView(), transform, filters);
    }	
    
    protected List<Map<String,Object>> findRows(Filters filters) {
        return rowReadViewRepository.find(getSavedView(), new NullTransform(), filters);
    }

    protected Map<String, Object> filter(List<Map<String, Object>> rows, String field, String value) {
        for ( var row : rows ) {
            if ( row.get(field).equals(value) ) {
                return row;
            }
        }
        
        throw new RuntimeException("Row " + field + "=" + value + " not found!");
    }
}
