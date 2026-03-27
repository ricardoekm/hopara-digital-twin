package hopara.dataset.filter;

import java.util.LinkedHashSet;

import hopara.dataset.row.read.LogicalOperator;

public class Filters extends LinkedHashSet<Filter> {

	private static final long serialVersionUID = 1L;
	public Filters() {}
	
	public Filters(LinkedHashSet<Filter> filters) {
	    super(filters);
	}

    public Filters(Filter filter) {
        super();
	    add(filter);
	}

    public Filter get(String column) {
        for ( var filter : this ) {
            if ( filter.getColumn().equalsIgnoreCase(column) ) {
                return filter;
            }
        }
        
        return null;
   }
	
	public boolean contains(String column) {
	    return this.get(column) != null;
	}
	
	public Filters append(Filters filters) {
	    var appendedFilters = clone();
	    appendedFilters.addAll(filters);
	    return appendedFilters;
	}

    public void delete(String column) {
        var filter = get(column);
        if ( filter != null ) {
            remove(filter);
        }
    }

	public Filters getLogicalOperatorFilters(LogicalOperator logicalOperator) {
		var filters = new Filters();
		for ( var filter : this ) {
			if ( filter.getLogicalOperator() == logicalOperator ) {
				filters.add(filter);
			}
		} 
		return filters;
	}

	public Filters getAndFilters() {
		return getLogicalOperatorFilters(LogicalOperator.AND);
	}

	public Boolean hasSecurityFilters() {
		return getSecurityFilters().size() > 0;
	}

	public Filters getSecurityFilters() {
		var filters = new Filters();
		for ( var filter : this ) {
			if ( filter.isSecurity() ) {
				filters.add(filter);
			}
		}

		return filters;
	}

	@Override
	public Filters clone() {
	    return new Filters(this);
	}
}
