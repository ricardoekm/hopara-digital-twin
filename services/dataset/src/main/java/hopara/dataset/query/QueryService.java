package hopara.dataset.query;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import hopara.dataset.SqlSanitizer;
import hopara.dataset.column.QueryColumnService;
import hopara.dataset.database.Database;
import hopara.dataset.datasource.DataSourceRepository;
import hopara.dataset.filter.Filters;
import hopara.dataset.row.read.Pagination;
import hopara.dataset.row.read.RowReadViewRepository;
import hopara.dataset.sqlquery.QueryParseError;
import hopara.dataset.sqlquery.SqlQuery;
import hopara.dataset.view.View;
import hopara.dataset.view.ViewRepository;

@Component
public class QueryService {
    @Autowired
    RowReadViewRepository rowReadViewRepository; 

    @Autowired
	QueryColumnService columnService;

    @Autowired
	Database database;

    @Autowired
    DataSourceRepository dataSourceRepository;

    @Autowired
    ViewRepository viewRepository;

    private View createTempView(String dataSource, String query) {
        var suffix = String.valueOf(query.hashCode());
        var view = new View(dataSource, "temp_view_" + suffix, query, database.getDbClass());
        var columns = columnService.getFromQueryExecution(view.getSqlQuery());
        view.addColumns(columns);
        return view;
    }    

    public QueryRunResult run(String dataSource, String query) {
        dataSourceRepository.setCurrentName(dataSource);

        var view = createTempView(dataSource, query);
        viewRepository.validate(view);
        var rows = rowReadViewRepository.find(view, new Filters(), new Pagination(100, 0));

        var queryResult = new QueryRunResult();
        queryResult.setColumns(view.getColumns());
        queryResult.setRows(rows);
        return queryResult;
    }

    public void validate(String dataSource, String query) {
        try {
            dataSourceRepository.setCurrentName(dataSource);
            SqlQuery.validate(query, database.getDbClass());
        } catch(QueryParseError e) {
            throw new IllegalArgumentException(e);
        }
    }

    public QueryMetadata getMetadata(String dataSource, String query) {
        dataSourceRepository.setCurrentName(dataSource);

        var view = createTempView(dataSource, query);
        var queryMetadata = new QueryMetadata();
        queryMetadata.setColumns(view.getColumns());
        for ( var table : view.getSqlQuery().getTableNames() ) {
            queryMetadata.addTableName(table);
        }

        return queryMetadata;
    }    
}
