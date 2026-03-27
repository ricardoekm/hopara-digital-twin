package hopara.dataset.row.read.condition;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import hopara.dataset.column.Column;
import hopara.dataset.column.ColumnType;
import hopara.dataset.database.Database;
import hopara.dataset.filter.Filter;

@Component
public class ConditionBuilderFactory {
    
    @Autowired
    Database database;
    
    public void setDatabase(Database database) {
        this.database = database;
    }
    
    private ConditionBuilder doGetConditionBuilder(Column column) {
        if ( column == null ) {
            return database.getStringConditionBuilder();
        }
        
        if ( column.isType(ColumnType.GEOMETRY) ) {
            return database.getGeometryConditionBuilder();
        }
        else if ( column.getType().isArray() ) {
            return database.getArrayConditionBuilder();
        }
        else if ( column.isTemporal() ) {
            return database.getTemporalConditionBuilder();
        }
        else if ( column.isQuantitative() ) {
            return database.getNumericConditionBuilder();
        }
        else if ( column.isType(ColumnType.BOOLEAN) ) {
            return database.getBooleanConditionBuilder();
        }
        else {
            return database.getStringConditionBuilder();
        }
    }

	public ConditionBuilder getBuilder(Column column, Filter filter) {
	    var conditionBuilder = doGetConditionBuilder(column);
	    if ( column != null && !conditionBuilder.getSupportedComparions().contains(filter.getComparisonType()) ) {
	        throw new IllegalArgumentException("Column " + column.getName() + " as " + column.getType() + " doesnt support comparison " + filter.getComparisonType());
	    }
	    
		return conditionBuilder;
	}
}
