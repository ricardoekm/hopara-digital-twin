package hopara.dataset.row.read.condition.mysql;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import hopara.dataset.filter.Operator;
import hopara.dataset.filter.Filter;
import hopara.dataset.row.read.condition.ArrayConditionBuilder;

public class MySqlArrayConditionBuilder implements ArrayConditionBuilder {

    public MySqlArrayConditionBuilder() {
    }
        
    @Override
    public String getCondition(Filter filter, String sourceName) { 
        var conditions = new ArrayList<String>();
        
        for ( var i = 0; i < filter.getValues().size(); i++ ) {
            conditions.add("JSON_ARRAY_CONTAINS_STRING(" + filter.getSqlColumn() + ",:" + filter.getParamName(i) + ")");
        }
        
        if ( filter.getComparisonType() == Operator.EQUALS ) {
            // The len is required for clustering algos where you just want to return the set with this exact match
            return String.join(" AND ", conditions) +
                   " AND JSON_LENGTH(" + filter.getSqlColumn() + ") = :filterValuesLen_" + filter.getSqlColumn();
        }   
        else {
           return  String.join(" AND ", conditions);
        }
    }
    
    @Override
    public Map<String,Object> getParams(Filter filter) {
        var queryParams = new HashMap<String,Object>();

        for ( var i = 0; i < filter.getValues().size(); i++ ) {
            queryParams.put(filter.getParamName(i), filter.getValues().get(i));   
        }
        
        queryParams.put("filterValuesLen_" + filter.getColumn(), filter.getValues().size());

        
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
