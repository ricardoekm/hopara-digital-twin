package hopara.dataset.row.read;

import java.util.ArrayList;
import org.springframework.stereotype.Component;

import hopara.dataset.filter.Filters;
import hopara.dataset.sqlquery.SqlQuery;
import hopara.dataset.table.Table;

@Component
public class TableSqlBuilder extends SqlBuilder {
    
	private String getSelectFields(Table table) {
		var columns = new ArrayList<String>();
		columns.addAll(table.getColumns().getNames());
		
		return String.join(",", columns);
	}
	
	public String getDefaultQuery(Table table) {
		return  "SELECT " + getSelectFields(table) + " "
	  		    + "FROM " + table.getSqlName();
	 }
	
	
	public String getQuery(Table table, Filters filters, Integer limit, Sort sort) {
		String queryText = getDefaultQuery(table);
		
		var query = new SqlQuery(queryText, database.getDbClass());
		query.addCte(table.getName(),getSourceQuery(table.getName(), table.getColumns(), filters, new Pagination(limit, null), sort));
		return query.toString();
	}
}
