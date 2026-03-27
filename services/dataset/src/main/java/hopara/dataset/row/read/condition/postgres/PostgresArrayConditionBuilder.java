package hopara.dataset.row.read.condition.postgres;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import hopara.dataset.filter.Operator;
import hopara.dataset.filter.Filter;
import hopara.dataset.row.read.condition.ArrayConditionBuilder;
import hopara.dataset.row.read.condition.StringConditionBuilder;

public class PostgresArrayConditionBuilder implements ArrayConditionBuilder {

    StringConditionBuilder stringConditionBuilder;
    
    public PostgresArrayConditionBuilder(StringConditionBuilder stringConditionBuilder) {
        this.stringConditionBuilder = stringConditionBuilder;
    }
    
	@Override
	public String getCondition(Filter filter, String sourceName) {		
		if ( filter.getComparisonType() == Operator.EQUALS ) {
		    // The len is required for clustering algos where you just want to return the set with this exact match
		    return filter.getSqlColumn() + " @> :" + filter.getParamName() +
		           " AND array_length(" + filter.getSqlColumn() + ",1) = :filterValuesLen_" + filter.getColumn();
		}	
		else {
			var partialFilter = new Filter(filter.getColumn(),filter.getValues(),Operator.PARTIAL_MATCH);
		    return "EXISTS (SELECT 1 FROM UNNEST(" + filter.getSqlColumn() + ") AS " + filter.getColumn() +
		           " WHERE " + stringConditionBuilder.getCondition(partialFilter, sourceName) + ")";
		}
	}
	
	@Override
	public Map<String,Object> getParams(Filter filter) {
		var queryParams = new HashMap<String,Object>();

		if ( filter.getComparisonType() == Operator.EQUALS ) {
	        var valuesArray = filter.getValues().toArray(new String[filter.getValues().size()]);
	        queryParams.put(filter.getParamName(), valuesArray);  
	        queryParams.put("filterValuesLen_" + filter.getColumn(), valuesArray.length);
		}
		else {
		    var stringFilter = new Filter(filter.getColumn(),Operator.PARTIAL_MATCH);
		    stringFilter.setValues(filter.getValues());
		    return stringConditionBuilder.getParams(stringFilter);
		}

		
		return queryParams;
	}

    @Override
    public List<Operator> getSupportedComparions() {
        var supportedComparisons = new ArrayList<Operator>();
        
        supportedComparisons.add(Operator.EQUALS);
        supportedComparisons.add(Operator.NOT_EQUALS);
        supportedComparisons.add(Operator.PARTIAL_MATCH);

        return supportedComparisons;
    }
}
