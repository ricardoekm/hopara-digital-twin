package hopara.dataset.row.read.condition;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import hopara.dataset.database.Database;
import hopara.dataset.filter.Operator;

@Component
public class StringConditionBuilder extends BaseConditionBuilder {
    
    public StringConditionBuilder(Database database) {
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

    protected Object castValue(Object value, Operator comparisonType) {
        if ( value instanceof Number ) {
            return ((Number) value).toString();
        } 

        return super.castValue(value, comparisonType);
    }
}
