package hopara.dataset.filter;

import java.util.ArrayList;
import java.util.List;

import org.springframework.util.StringUtils;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSetter;

import hopara.dataset.SqlSanitizer;
import hopara.dataset.row.read.LogicalOperator;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Filter {	
	List<Object> values = new ArrayList<Object>();	
	String compressedValues;		
	String column;
	Operator comparisonType;
	Boolean optional = true;
	Boolean security = false;
	LogicalOperator logicalOperator;
	Boolean quoteIdentifiers = false;

	// Should use FilterFactory to follow the quote rule
	protected Filter(String columnName) {
		this.column = SqlSanitizer.cleanString(columnName);
	}
	
	// Should use FilterFactory to follow the quote rule
	protected Filter(String columnName, List<Object> values) {
		this.column = SqlSanitizer.cleanString(columnName);
		this.values = values;
	}

	// Should be used only by tests
	public static Filter unsafeCreate(String columnName) {
		return new Filter(columnName);
	}

	protected void setQuoteIdentifiers(Boolean quoteIdentifiers) {
		this.quoteIdentifiers = quoteIdentifiers;
	}
	
	public Filter(String columnName, Object value) {
		var values = new ArrayList<Object>();
		values.add(value);

		this.column = SqlSanitizer.cleanString(columnName);
		this.values = values;
	}
	
    public Filter(String columnName, Operator comparisonType) {
        this(columnName);
        
        setComparisonType(comparisonType);
    }
	
    public Filter(String columnName, Object value, Operator comparisonType) {
        this(columnName, value);
        
        setComparisonType(comparisonType);
    }
   
	
	public Filter() {}
	
    public String getParamName() {
        return "filterValue_" + getComparisonType() + "_" + getColumn();
    }
    
    public static Boolean isFilterParam(String param) {
        return param.startsWith("filterValues");
    }
    
    public String getParamName(Integer index) {
        return getParamName() + "_" + index;
    }

	public void addValue(Object value) {
		this.values.add(value);
	}

	@JsonSetter
	public void setCompressedValues(String compressedValues) {
		this.compressedValues = compressedValues;
	}

	public Boolean hasCompressedValues() {
		return StringUtils.hasText(compressedValues);
	}

	@JsonIgnore
	public String getCompressedValues() {
		return compressedValues;
	}
		
	public List<Object> getValues() {	
		return values;
	}
	
	@JsonIgnore
	public boolean hasValues() {
		return this.values.size() > 0;
	}

	@JsonIgnore
	public boolean hasNotNullValues() {
	    var nullCount = 0;
	    for ( var value : values ) {
	        if ( value == null ) {
	            nullCount++;
	        }
	    }
	    
	    if ( nullCount == values.size() ) {
	        return false;
	    }
	    
		return values.size() > 0;
	}
	
	public String getColumn() {
		return SqlSanitizer.cleanString(column);
	}
	
	private String getQuotedColumn() {
		return "\"" + SqlSanitizer.basicCleanString(column) + "\"";
	}

	@JsonIgnore
    public String getSqlColumn() {
        if ( this.quoteIdentifiers ) {
            return getQuotedColumn();
        } 
        else {
            return getColumn();
        }
    }

	public String getId() {
		return column;
	}
	
	public void setComparisonType(Operator comparisonType) {
		this.comparisonType = comparisonType;
	}
	
	public Operator getComparisonType() {
		if ( comparisonType == null ) {
		    return Operator.EQUALS;
		}
		
		return comparisonType;
	}

	// If the filter is not optional we'll include it regardless if the table has the column or not.
	// If the table doenst have the column it will break, used for id update
	public Boolean isOptional() {
        return optional;
    }
	
	public void setOptional(Boolean optional) {
        this.optional = optional;
    }

	public void setSecurity(Boolean security) {
		this.security = security;
	}

	public Boolean isSecurity() {
		return security;
	}
	
    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((column == null) ? 0 : column.hashCode());
        result = prime * result + ((comparisonType == null) ? 0 : comparisonType.hashCode());
		result = prime * result + ((logicalOperator == null) ? 0 : logicalOperator.hashCode());
        result = prime * result + values.size();
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Filter other = (Filter) obj;
        if (column == null) {
            if (other.column != null)
                return false;
        } else if (!column.equals(other.column))
            return false;
		if (logicalOperator == null) {
				if (other.logicalOperator != null)
					return false;
			} else if (!logicalOperator.equals(other.logicalOperator))
				return false;
        if (comparisonType != other.comparisonType)
            return false;
        if (values == null) {
            if (other.values != null)
                return false;
        } else if (values.size() != other.values.size()) // the cache should ignore the actual value but should consider the param count
                                                         // otherwise it will generate more params in the query than the actual params
            return false;
        return true;
    }

    @Override
	public String toString() {
		return "Filter [column=" + column + ",values=" + values + "]";
	}

    public void setValues(List<Object> values) {
        this.values = values;
    }

	public void setLogicalOperator(LogicalOperator logicalOperator) {
		this.logicalOperator = logicalOperator;
	}

	public LogicalOperator getLogicalOperator() {
		if ( logicalOperator == null ) {
			return LogicalOperator.AND;
		}

		return this.logicalOperator;
	}

	public LogicalOperator getConditionsLogicalOperator() {
		if ( this.comparisonType == Operator.NOT_EQUALS ) {
			return LogicalOperator.AND;
		}
		return LogicalOperator.OR;
	}


}
