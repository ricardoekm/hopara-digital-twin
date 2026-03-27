package hopara.dataset.row;

import hopara.dataset.filter.Filters;

// Multiple tests passes the same table with the same filters, however the tables are different between tests,
// This helps bypass the cache on the TableSqlBuilder class
public class NoCacheFilters extends Filters {
    /**
     * 
     */
    private static final long serialVersionUID = 1L;

    @Override
    public boolean equals(Object o) {
        return false;
    }
}
