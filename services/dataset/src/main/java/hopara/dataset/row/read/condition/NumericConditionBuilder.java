package hopara.dataset.row.read.condition;

import java.util.ArrayList;
import java.util.List;

import hopara.dataset.database.Database;
import hopara.dataset.filter.Operator;
import hopara.dataset.filter.Filter;

public class NumericConditionBuilder extends BaseConditionBuilder {
    public NumericConditionBuilder(Database database) {
        super(database);
    }

    @Override
    public List<Operator> getSupportedComparions() {
        var supportedComparisons = new ArrayList<Operator>();
        
        supportedComparisons.add(Operator.EQUALS);
        supportedComparisons.add(Operator.NOT_EQUALS);
        supportedComparisons.add(Operator.GREATER_EQUALS_THAN);
        supportedComparisons.add(Operator.GREATER_THAN);
        supportedComparisons.add(Operator.LESS_EQUALS_THAN);
        supportedComparisons.add(Operator.LESS_THAN);
        supportedComparisons.add(Operator.PARTIAL_MATCH);

        return supportedComparisons;
    }

    @Override
    protected String getColumnLeftSideStatement(Filter filter) {
        if ( filter.getComparisonType() == Operator.PARTIAL_MATCH ) {
            return "CAST(" + filter.getSqlColumn() + " AS TEXT)";
        }

        return super.getColumnLeftSideStatement(filter);
    }
    
    @Override
    protected Object castValue(Object value, Operator comparisonType) {
        if ( comparisonType == Operator.PARTIAL_MATCH ) {
            return value.toString();
        }

        if ( value instanceof String ) {
            try {
                return Integer.parseInt((String)value);
            } catch(Exception e) { 
                try {
                   return Double.parseDouble((String)value);
                } catch(Exception e2) {
                    throw new IllegalArgumentException("Cant cast " + value + " to numeric in order to apply filter.");
                }
            }
        }

        return super.castValue(value, comparisonType);    
    }
}
