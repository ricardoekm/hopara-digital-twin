package hopara.dataset.row.read;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;

import hopara.dataset.filter.Filters;
import hopara.dataset.sqlquery.AddMode;
import hopara.dataset.sqlquery.SqlQuery;
import hopara.dataset.transform.QueryProcessingTransform;
import hopara.dataset.transform.Transform;
import hopara.dataset.view.View;

@Component
public class ViewSqlBuilder extends BaseViewSqlBuilder {
    
    private SqlQuery getTransformQuery(View view, String baseCteName, Transform transform) {
        if ( transform == null || !(transform instanceof QueryProcessingTransform) ) {
            return null;
        }
        
        var queryTransform = (QueryProcessingTransform)transform;
        var queryText = queryTransform.getQuery(view.getColumns(), baseCteName);
        return new SqlQuery(queryText, database.getDbClass());
    }

    public SqlQuery getFilteredQuery(View view, Filters filters, Pagination pagination, Sort sort) {
        var queryText = getSourceQuery(view.getQueryName(), view.getColumns(), filters, pagination, sort);
        var query = new SqlQuery(queryText, database.getDbClass());

        // Sometimes the filter is applied on the outer query, this may return 0 rows because of the limit applied in the inner query
        var viewQuery = view.getSqlQuery();
        if ( viewQuery.hasLimit() ) {
            query.setLimitFrom(viewQuery);
        }

        return query;
    }

    private SqlQuery getOuterQuery(View view, Transform transform, Filters filters, Pagination pagination, DistanceSort distanceSort) {
        var baseCteName = view.getQueryName("filter");
        var transformQuery = getTransformQuery(view, baseCteName, transform);
        var filterQuery = getFilteredQuery(view, filters, pagination, distanceSort);
		
        SqlQuery query;
        if ( transformQuery != null ) {
            query = transformQuery;
            query.addCte(baseCteName, filterQuery.toString());
        }
        else {
            query = filterQuery;
        }
        return query;
    }

    public Filters getTableFilters(View view, Filters filters) {
        var tableFilters = new Filters();
        if ( view.shouldFilterTables() ) {
            // If it's OR operator the clause may be split between different tables and then no record will be fetched
            tableFilters.addAll(filters.getAndFilters());
        }

        if ( filters.hasSecurityFilters() ) {
            tableFilters.addAll(filters.getSecurityFilters());
        }

        return tableFilters;
    }

    @Cacheable(CACHE_NAME)
	public String getQuery(View view, Transform transform, Filters filters, Pagination pagination, DistanceSort distanceSort) {
        // Create a query with filters referencing a to be created CTE
        SqlQuery query = getOuterQuery(view, transform, filters, pagination, distanceSort);
        
        // See getFilterQuery method
        var viewQuery = view.getSqlQuery();
        if ( viewQuery.hasLimit() ) {
            viewQuery.removeLimit();
        }
        
        // Creates a CTE with the actual query
        query.addCte(view.getQueryName(), viewQuery.toString(), AddMode.PREPEND);        
    
        // If filter tables is true creates a CTE for each table with filters
        var tableFilters = getTableFilters(view, filters);
        if ( tableFilters.size() > 0 ) {
            addTableCtes(view, tableFilters, view.getSqlQuery(), query);
        }
        
		return query.toString();
	}

	// Returns the view query wrapped in a CTE which may be referenced by the queryText
    @Cacheable(CACHE_NAME)
	public String getCteQuery(View view, String queryText, Integer limit) {
	    var query = new SqlQuery(queryText, database.getDbClass());	    	    	   
        
        query.addCte(view.getQueryName(), view.getSqlQuery().toString());	          
        query.setLimit(limit);
        
        return query.toString();
	}

    // Same as getCteQuery but it filters the referenced tables using the filters
    @Cacheable(CACHE_NAME)
	public SqlQuery getFilteredCteQuery(View view, Filters filters, String queryText, Integer limit) {
	    var query = new SqlQuery(queryText, database.getDbClass());	    

        addTableCtes(view, filters.getAndFilters(), view.getSqlQuery(), query);
        query.addCte(view.getQueryName(), view.getSqlQuery().toString());	  
        
        if ( limit != null ) {
            query.setLimit(limit);
        }
        
        return query;
	}
}
