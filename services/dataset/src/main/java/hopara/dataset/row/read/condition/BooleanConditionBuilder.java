package hopara.dataset.row.read.condition;

import java.util.ArrayList;
import java.util.List;

import hopara.dataset.database.Database;
import hopara.dataset.filter.Operator;
import hopara.dataset.filter.Filter;

public class BooleanConditionBuilder extends BaseConditionBuilder {

    public BooleanConditionBuilder(Database database) {
        super(database);
    }

    @Override
    public List<Operator> getSupportedComparions() {
        var supportedComparisons = new ArrayList<Operator>();
        supportedComparisons.add(Operator.EQUALS);
        supportedComparisons.add(Operator.NOT_EQUALS);
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
            return Boolean.parseBoolean((String)value);
        }
        
        return super.castValue(value, comparisonType);
    }
}
