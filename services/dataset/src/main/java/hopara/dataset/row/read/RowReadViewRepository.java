package hopara.dataset.row.read;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.stereotype.Component;

import hopara.dataset.column.ColumnService;
import hopara.dataset.column.Columns;
import hopara.dataset.filter.Filters;
import hopara.dataset.sqlquery.SqlQuery;
import hopara.dataset.transform.NullTransform;
import hopara.dataset.transform.Transform;
import hopara.dataset.transform.TransformType;
import hopara.dataset.view.View;

@Component
public class RowReadViewRepository extends RowReadRepository {
    @Autowired
    ViewSqlBuilder viewSqlBuilder;

    @Autowired
    ColumnService columnService;

    private Log logger = LogFactory.getLog(RowReadViewRepository.class);

    private Columns getColumns(View view, Transform transformParams) {
        if ( transformParams == null || transformParams.getType() == TransformType.NONE ) {
            if ( view.shouldFilterTables() ) {
                return view.getAllColumns();
            } 
            else {
                return view.getColumns();
            }
        }
        else {
            return view.getColumns(transformParams);
        }
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> doFind(View view, Transform transform, Filters filters, String query) {        
        var columns = getColumns(view, transform);        
        var queryParams = filterService.getParams(columns, filters);     
        logQuery(queryParams, query);
           
        try {
            var converter = converterExecutorFactory.create(columns);
            var rows = namedJdbcTemplate.queryForList(query, queryParams);
            List<Object> processedRows = rows.stream()
                                             .map(row -> converter.fromDatabaseFormat(row))
                                             .collect(Collectors.toList());
            return (List<Map<String,Object>>)(Object)processedRows;
        } catch(InvalidDataAccessApiUsageException e) {
            var sqlQuery = new SqlQuery(getQueryWithParams(query, queryParams), database.getDbClass());
			logger.error(sqlQuery.toPrettyString());
			logger.error(queryParams);	

            throw e;
        }
    }

    public List<Map<String,Object>> find(View view, Transform transform, Filters filters, Pagination pagination, DistanceSort distanceSort) {        
        var query = viewSqlBuilder.getQuery(view, transform, filters, pagination, distanceSort);
        return doFind(view, transform, filters, query);
    }

    public List<Map<String,Object>> find(View view, Transform transform, Filters filters, Pagination pagination) {        
        return find(view, transform, filters, pagination, null);
    }

    public List<Map<String,Object>> find(View view, Filters filters, Pagination pagination) {        
        return find(view, new NullTransform(), filters, pagination, null);
    }

    public List<Map<String,Object>> find(View view, Transform transform, Filters filters) {    
        return find(view, transform, filters, new Pagination(defaultFetchLimit, null), null);
    }
}
