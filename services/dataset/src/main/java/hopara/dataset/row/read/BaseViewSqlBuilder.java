package hopara.dataset.row.read;

import org.springframework.beans.factory.annotation.Autowired;

import hopara.dataset.database.Database;
import hopara.dataset.database.DatabaseType;
import hopara.dataset.filter.Filters;
import hopara.dataset.sqlquery.AddMode;
import hopara.dataset.sqlquery.SqlQuery;
import hopara.dataset.sqlquery.SqlTable;
import hopara.dataset.table.TableKey;
import hopara.dataset.table.TableService;
import hopara.dataset.table.Tables;
import hopara.dataset.view.View;

public abstract class BaseViewSqlBuilder extends SqlBuilder {
    @Autowired
    TableService tableService;

    @Autowired
    Database database;
    
    public static final String CACHE_NAME = "viewQueries";
        
    protected Tables getQueryTables(String dataSourceName, SqlQuery query) {        
        var queryTables = new Tables();
        for ( var tableName : query.getTableNames() ) {
            var tableKey = new TableKey(dataSourceName, tableName);
            if ( tableService.has(tableKey)) {
                queryTables.add(tableService.find(tableKey));
            }
        }
        
        return queryTables;
    }
    
    public Tables getTables(View view) {
        return getQueryTables(view.getDataSourceName(), view.getSqlQuery());
    }
    
    private String getCteName(SqlTable table) {        
        return table.getOriginalName();
    }
    
    public void addTableCtes(View view, Filters filters, SqlQuery viewQuery, SqlQuery outsideQuery) {
        // https://github.com/duckdb/duckdb/issues/9187
        if ( database.isType(DatabaseType.DUCKDB) ) {
            return;
        }
        
        for ( var table : getQueryTables(view.getDataSourceName(), viewQuery) ) {            
            var sqlTable = viewQuery.getTable(table.getName());
            
            var cteName = getCteName(sqlTable);
            var sourceQuery = getSourceQuery(table.getSqlName(), table.getColumns(), filters, new Pagination(), null);
            outsideQuery.addCte(cteName,sourceQuery,AddMode.PREPEND);
        }
    }
}
