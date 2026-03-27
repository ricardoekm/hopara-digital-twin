package hopara.dataset.row.read;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import hopara.dataset.column.Columns;
import hopara.dataset.database.Database;
import hopara.dataset.filter.Filters;
import hopara.dataset.row.read.condition.ConditionBuilderFactory;

public abstract class SqlBuilder {
	
	@Autowired
	ConditionBuilderFactory conditionSqlBuilderFactory;

	@Autowired
	Database database;
	
	private List<String> getConditions(Columns columns, Filters filters, String sourceName) {
		var conditions = new ArrayList<String>();
		for ( var filter : filters ) {
			if ( columns.contains(filter.getColumn()) ) {
				var conditionBuilder = conditionSqlBuilderFactory.getBuilder(columns.get(filter.getColumn()),filter);
				conditions.add(conditionBuilder.getCondition(filter, sourceName));
			}
		}
		return conditions;
	}

	private String getConditionsStatement(Columns columns, Filters filters, LogicalOperator logicalOperator, String sourceName) {
		var conditions = getConditions(columns, filters.getLogicalOperatorFilters(logicalOperator), sourceName); 
		return String.join(" " + logicalOperator.toString() + " ", conditions);
	}

	protected String getFilterWhereClause(Columns columns, Filters filters, String sourceName) {
		var andConditions = getConditionsStatement(columns, filters, LogicalOperator.AND, sourceName); 
		var orConditions = getConditionsStatement(columns, filters, LogicalOperator.OR, sourceName); 

		if ( !andConditions.isEmpty() && !orConditions.isEmpty() ) {
			return "WHERE " + andConditions + " AND (" + orConditions + " )";
		}
		else if ( !andConditions.isEmpty() )  {
			return "WHERE " + andConditions;
		}
		else if ( !orConditions.isEmpty() ) {
			return "WHERE " + orConditions;
		}

		return "";
	}

	
	public String getWhereClause(Columns columns, Filters filters, String sourceName) {
		return getFilterWhereClause(columns, filters, sourceName);
	}
	
	private String getLimitClause(Integer limit) {
	    if ( limit == null ) {
	        return "";
	    }
	    
	    // We return an additional row to inform whether this was a partial response
		return "LIMIT " + (limit + 1);
	}

	private String getOffsetClause(Integer offset) {
	    if ( offset == null ) {
	        return "";
	    }
	    
		return "OFFSET " + offset;
	}

    private String getOrderByClause(Sort sort) {
        if ( sort == null ) {
            return "";
        }

        return "ORDER BY " + sort.getClause(database);
    }
	
	public String getSourceQuery(String sourceName, Columns sourceColumns, Filters filters, Pagination pagination, Sort sort) {
		return "SELECT * FROM " + sourceName + " " + 
                getWhereClause(sourceColumns, filters, sourceName) + " " +
                getOrderByClause(sort) + " " +
                getLimitClause(pagination.getLimit()) + " " + 
                getOffsetClause(pagination.getOffset());
	}	
}
