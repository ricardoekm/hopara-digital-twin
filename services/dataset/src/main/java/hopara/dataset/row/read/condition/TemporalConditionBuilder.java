package hopara.dataset.row.read.condition;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Component;

import hopara.dataset.database.Database;
import hopara.dataset.filter.Operator;
import hopara.dataset.time.DateParser;

@Component
public class TemporalConditionBuilder extends BaseConditionBuilder {

    public TemporalConditionBuilder(Database database) {
        super(database);
    }

    private Class<? extends Object> getClass(Object value) {
        if ( value == null ) {
            return null;
        }
        
        return value.getClass();
    }
    
    @Override
    protected Object castValue(Object value, Operator comparisonType) {
        if ( value instanceof Date ) {
            return value;
        }
        else if ( value instanceof Number ) {
            var epoch = ((Number)value).longValue();
            return new Date(epoch);
        }
        else if ( value instanceof String ) {
            return DateParser.parse((String)value);
            
        }
        
        throw new IllegalArgumentException("Could not cast " + value + " of type " + getClass(value) + " to a date");
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

        return supportedComparisons;
    }

}
