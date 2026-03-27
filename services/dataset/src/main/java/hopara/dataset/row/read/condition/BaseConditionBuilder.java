package hopara.dataset.row.read.condition;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import hopara.dataset.database.Database;
import hopara.dataset.filter.Operator;
import hopara.dataset.filter.Filter;

public abstract class BaseConditionBuilder implements ConditionBuilder {
    
    protected Database database;
    
    public BaseConditionBuilder(Database database) {
        this.database = database;
    }


    protected String getColumnLeftSideStatement(Filter filter) {
        return filter.getSqlColumn();
    }

    protected String getValueCondition(Filter filter, String paramName, String sourceName) {
        return getColumnLeftSideStatement(filter) + " " + database.getSqlOperator(filter.getComparisonType()) + " :" + paramName;
    }

    protected String getNullValueCondition(Filter filter, String paramName) {
        return getColumnLeftSideStatement(filter)  + " " + database.getSqlOperator(Operator.IS) + " NULL";
    }

    public String getCondition(Filter filter, String sourceName) {
        var conditions = new ArrayList<String>();
        
        for ( var i = 0; i < filter.getValues().size(); i++ ) {
            if ( filter.getValues().get(i) == null) {
                conditions.add(getNullValueCondition(filter, filter.getParamName(i)));        
            }
            else {
                conditions.add(getValueCondition(filter, filter.getParamName(i), sourceName));
            }
        }

        var condition = String.join(" " + filter.getConditionsLogicalOperator().toString() + " ", conditions);
        return "(" + condition + ")";
    }
    
    public Map<String, Object> getParams(Filter filter) {
        var queryParams = new HashMap<String,Object>();

        for ( var i = 0; i < filter.getValues().size(); i++ ) {
            var value = filter.getValues().get(i);
            if ( value == null ) {
                queryParams.put(filter.getParamName(i), value);   
            }
            else {
                if ( filter.getComparisonType() == Operator.PARTIAL_MATCH ) {
                    value = "%" + value + "%";
                }
                
                queryParams.put(filter.getParamName(i), castValue(value, filter.getComparisonType()));   
            }
        }
        
        return queryParams;
    }
    
    // Template method
    protected Object castValue(Object value, Operator comparisonType) {
        return value;
    }

}
