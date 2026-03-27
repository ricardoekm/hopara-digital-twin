package hopara.dataset.column;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.SerializationUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import hopara.dataset.database.Database;
import hopara.dataset.filter.Filters;
import hopara.dataset.row.QueryFilterService;
import hopara.dataset.row.read.ViewSqlBuilder;
import hopara.dataset.view.View;

@Component
public class ColumnValuesRepository {
	@Autowired
	@Qualifier("dataNamedJdbcTemplate")
	protected NamedParameterJdbcTemplate dataNamedJdbcTemplate;
	
	@Value("${valueFetchLimit:50}")
	public Integer fetchLimit;

	@Value("${valuesScanLimit:1000}")
	public Integer valuesScanLimit;
	
	@Autowired
	protected QueryFilterService filterService;
	
	@Autowired
	protected Database database;

	@Autowired
	protected ColumnValueRowMapper columnValueRowMapper;

	@Autowired
	ViewSqlBuilder viewSqlBuilder;
	
	protected Integer getLimit(Integer limit) {
		if (limit == null) {
			return fetchLimit;
		}
		return Math.min(limit, this.fetchLimit);
	}

	public void setFetchLimit(Integer fetchLimit) {
		this.fetchLimit = fetchLimit;
	}

	public Integer getFetchLimit() {
		return fetchLimit;
	}
	
	private String getWhereClause(Columns columns, Column column, Filters filters, String sourceName) {
		// We'll mutate the column to string if it's an array
		columns = SerializationUtils.clone(columns);
		column = columns.get(column.getName());

		var where = " WHERE " + column.getSqlName() + " IS NOT NULL ";
		if ( column.isType(ColumnType.STRING)){
            where +="AND " + column.getSqlName() + " <> ''";
		}
		       
		where += filterService.getWhereClause(columns, filters, sourceName);
		return where;
	}
	
	private String getSelectClause(String viewName, Column column) {
		var select = "SELECT DISTINCT " + column.getSqlName() + " AS columnValue, count(*) as count FROM ";
	    return select + viewName;
	}

	private String doGetValuesQuery(View view, Filters filters, Column column) {
		return  getSelectClause(view.getQueryName(), column)
				+ getWhereClause(view.getColumns(),column,filters, view.getQueryName())
				+ " GROUP BY " + column.getSqlName()
				+ " ORDER BY count(*) DESC";
	}

	private String getValuesQuery(View view, String columnName, Filters filters, Integer limit) {
		view = view.clone();
		view.setLimit(valuesScanLimit);	

	    var column = view.getColumns().get(columnName);
		return viewSqlBuilder.getFilteredCteQuery((View)view, viewSqlBuilder.getTableFilters(view, filters) ,
                                                  doGetValuesQuery(view, filters, column), getLimit(limit)).toString();
	}
	
	private Map<String,Object> getParameters(Columns columns, String columnName, Integer limit, Filters filters) {
		columns = SerializationUtils.clone(columns);
		var queryParameters = filterService.getParams(columns, filters);			
		queryParameters.put("limit", getLimit(limit));        
		return queryParameters;
	}

	public  List<Object> getValues(View view, String column, Integer limit) {	
        var filters = new Filters();
		return this.getValues(view, column, filters,limit);
	}	
	
    private List<Object> processTypes(List<Object> values, ColumnType columnType) {
        if ( columnType.equals(ColumnType.BOOLEAN)) {
            var newValues = new ArrayList<Object>();
            for ( var value : values ) {
                newValues.add(database.getBooleanConverter().fromDatabaseFormat(value));
            }
            return newValues;
        }
            
        return values;
    }
	
    private void validateColumnExist(View view, String columnName) {
		if ( !view.getColumns().contains(columnName) ) {
			throw new IllegalArgumentException("Column " + columnName + " not found in " + view); 
		}
    }

    private Boolean shouldReturnValues(View view, String columnName) {
        var column = view.getColumns().get(columnName);
        return column.isQuantitative() || column.isType(ColumnType.STRING) || column.isType(ColumnType.BOOLEAN);
    }

	public List<Object> getValues(View view, String columnName, Filters filters, Integer limit) {	
        validateColumnExist(view, columnName);

        if ( !shouldReturnValues(view, columnName) ) {
            return new ArrayList<>();
        }

		view = view.cloneWithUniqueName();

		var query = getValuesQuery(view, columnName, filters, limit);
		var parameters = getParameters(view.getColumns(), columnName, limit, filters);

		var values = dataNamedJdbcTemplate.query(query, parameters, columnValueRowMapper);
		return processTypes(values, view.getColumns().get(columnName).getType());
	}
}
