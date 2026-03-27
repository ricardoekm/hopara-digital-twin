package hopara.dataset.row;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import hopara.dataset.column.Columns;
import hopara.dataset.filter.Filter;
import hopara.dataset.filter.Filters;
import hopara.dataset.row.read.condition.ConditionBuilderFactory;

@Component
public class QueryFilterService {

	@Autowired
	protected ConditionBuilderFactory conditionBuilderFactory;
	
	public Map<String,Object> getParams(Columns columns, Filters filters) {
		var queryParams = new HashMap<String,Object>();

		for (Filter filter: filters) {			
			var column = columns.get(filter.getColumn()); 			
			var conditionBuilder = conditionBuilderFactory.getBuilder(column, filter);
			queryParams.putAll(conditionBuilder.getParams(filter));
		}

		return queryParams;
	}
	
	public String getWhereClause(Columns columns, Filters filters, String sourceName) {
		String whereClause = "";
		
		for ( var filter : filters ) {
			if ( (filter.isOptional() && columns.contains(filter.getColumn())) || !filter.isOptional() ) {
				var conditionBuilder = conditionBuilderFactory.getBuilder(columns.get(filter.getColumn()),filter);
				whereClause += " AND " + conditionBuilder.getCondition(filter, sourceName);
			}
		}
		
		return whereClause;
	}
}
