package hopara.dataset.stats.row;

import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import hopara.dataset.filter.Filters;
import hopara.dataset.row.QueryFilterService;
import hopara.dataset.row.read.ViewSqlBuilder;
import hopara.dataset.sqlquery.SqlQuery;
import hopara.dataset.stats.QuantitativeStatsRowMapper;
import hopara.dataset.stats.StatsGenerator;
import hopara.dataset.stats.column.ColumnStatsList;
import hopara.dataset.transform.QueryProcessingTransform;
import hopara.dataset.transform.Transform;
import hopara.dataset.view.View;

@Component
public class RowsStatsGenerator extends StatsGenerator {
	@Autowired
	protected QueryFilterService filterService;

    @Autowired
    protected ViewSqlBuilder viewSqlBuilder;

    @Autowired
    @Qualifier("longRunningDataNamedJdbcTemplate")
    private NamedParameterJdbcTemplate dataNamedJdbcTemplate;

    @Value("${statsScanLimit:10000}")
	public Integer statsScanLimit;

    protected SqlQuery getViewQuantitativeQuery(View view, Filters filters) {
        // To fix conflict with table with same name
        view = view.cloneWithUniqueName();
        view.setLimit(statsScanLimit);
        
        var statsQuery = getQuery(view.getQueryName(),view.getColumns());    
        return viewSqlBuilder.getFilteredCteQuery(view, filters, statsQuery, null);
    }

    protected ColumnStatsList generateViewStats(View view, Filters filters) {
        var columnStatsList = new ColumnStatsList();
        
        if ( hasQuantitativeStats(view.getColumns()) ) {
            var params = filterService.getParams(view.getAllColumns(), filters);
            var quantitativeRowMapper = new QuantitativeStatsRowMapper(database, view.getColumns());
            var query = getViewQuantitativeQuery(view, filters).toString();

            var result = dataNamedJdbcTemplate.query(query, params, quantitativeRowMapper);                
            if ( result.size() > 0 ) {
                columnStatsList.addAll(result.get(0));
            }
        }
        
        return columnStatsList;
    } 

    protected SqlQuery getTransformQuantitativeQuery(View view, QueryProcessingTransform transform, Filters filters) {
        // To fix conflict with table with same name
        view = view.cloneWithUniqueName();
        var transformCteName = view.getQueryName() + "_transform";
        var transformColumns = view.getColumns(transform);
        var statsQuery = getQuery(transformCteName, transformColumns); 

        // We clone to no modify the object in the cache returned by the filterd cte query
        var viewQuery = (SqlQuery)viewSqlBuilder.getFilteredCteQuery(view, filters, statsQuery, null).clone();
        var transformQuery = transform.getQuery(view.getColumns(),view.getQueryName());
        viewQuery.addCte(transformCteName,transformQuery);
        return viewQuery;
    }

    protected ColumnStatsList generateTransformStats(View view, QueryProcessingTransform transform, Filters filters) {
        var columnStatsList = new ColumnStatsList();
        var transformColumns = view.getColumns(transform);
        if ( hasQuantitativeStats(transformColumns) ) {
            var params = filterService.getParams(view.getAllColumns(), filters);
            var quantitativeRowMapper = new QuantitativeStatsRowMapper(database, transformColumns);
            var query = getTransformQuantitativeQuery(view, transform, filters).toString();

             var result = dataNamedJdbcTemplate.query(query, params, quantitativeRowMapper);                
            if ( result.size() > 0 ) {
                columnStatsList.addAll(result.get(0));
            }
        }

        return columnStatsList;
    }

    public ColumnStatsList generateStats(View view, Transform transform, Filters filters) {
        if ( transform == null || !(transform instanceof QueryProcessingTransform)) {
            return generateViewStats(view, filters);
        }
        else {
            return generateTransformStats(view, (QueryProcessingTransform)transform, filters);
        }
    }

    @Async
    public CompletableFuture<ColumnStatsList> asyncGenerateStats(View view, Transform transform, Filters filters) {
        return CompletableFuture.completedFuture(this.generateStats(view, transform, filters));
    }
}
