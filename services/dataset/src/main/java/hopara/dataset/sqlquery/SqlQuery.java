package hopara.dataset.sqlquery;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import gudusoft.gsqlparser.EDbVendor;
import gudusoft.gsqlparser.TGSqlParser;
import gudusoft.gsqlparser.nodes.TCTEList;
import gudusoft.gsqlparser.nodes.TGroupBy;
import gudusoft.gsqlparser.nodes.TGroupByItem;
import gudusoft.gsqlparser.nodes.TLimitClause;
import gudusoft.gsqlparser.pp.para.GFmtOpt;
import gudusoft.gsqlparser.pp.para.GFmtOptFactory;
import gudusoft.gsqlparser.pp.stmtformatter.FormatterFactory;
import gudusoft.gsqlparser.stmt.TSelectSqlStatement;
import hopara.dataset.database.DatabaseClass;

public class SqlQuery implements Cloneable {

	String queryText;
	TSelectSqlStatement parentSelect;
	DatabaseClass databaseClass;
	TGSqlParser parser;
	Map<String, String> ctes = new HashMap<String, String>();

	public static SqlQuery validate(String queryText, DatabaseClass databaseClass) {
		return new SqlQuery(queryText, databaseClass);
	}

	private String removeTrailingSemiColon(String queryText) {
		queryText = queryText.trim();
		if (queryText.charAt(queryText.length() - 1) == ';') {
			return queryText.substring(0, queryText.length() - 1);
		}

		return queryText;
	}

	private EDbVendor getVendor(DatabaseClass databaseClass) {
		switch( databaseClass ) {
			case POSTGRES:
            case SNOWFLAKE:
				return EDbVendor.dbvpostgresql;
			case MYSQL:
				return EDbVendor.dbvmysql;
		}

		return EDbVendor.dbvpostgresql;
	}

	public void init(String queryText, DatabaseClass databaseClass) {
		queryText = removeTrailingSemiColon(queryText);
		this.queryText = queryText;
		this.databaseClass = databaseClass;

		parser = new TGSqlParser(getVendor(databaseClass));
		parser.sqltext = queryText;
		var status = parser.parse();

		if (status != 0) {
			throw new QueryParseError("Query parse error " + parser.getErrormessage());
		}

		if (parser.sqlstatements.size() == 0) {
			throw new QueryParseError("No statement found");
		}

		parentSelect = (TSelectSqlStatement) parser.sqlstatements.get(0);
	}

	public void init(String queryText) {
		init(queryText, databaseClass);
	}

	public SqlQuery(String queryText, DatabaseClass databaseClass) {
		init(queryText, databaseClass);
	}

	public SqlQuery(String queryText) {
		init(queryText, DatabaseClass.POSTGRES);
	}

	private String buildNewCte(TCTEList cteList, String cte, AddMode addMode) {
		if ( addMode == AddMode.APPEND ) {
			return cteList.toString() + ",\n" + cte;
		}
		else {
			return cte + ",\n" + cteList.toString();
		}
	}

	public void addCte(String table, String query, AddMode addMode) {
		var cteList = parentSelect.getCteList();
		if (cteList != null && cteList.size() > 0) {
			// Call me Gambeta Master
			var cte = table + " AS (" + query + ")";			
			var newCte = buildNewCte(cteList, cte, addMode);
			var newQuery = parentSelect.toString().replace(cteList.toString(), newCte);

			init(newQuery);
		} else {
			var cte = "WITH " + table + " AS (" + query + ")";
			init(cte + "\n" + queryText);
		}
	}

	public void addCte(String table, String query) {
		addCte(table, query, AddMode.APPEND);
	}

	public List<TSelectSqlStatement> getTableSelects(String tableName) {
		var selects = new ArrayList<TSelectSqlStatement>();
		for (var table : parentSelect.getTables()) {
			if (table.getName().equalsIgnoreCase(tableName)) {
				selects.add(parentSelect);
			}
		}

		// E.g. with clauses or subselects
		for (var nestedStatement : parentSelect.getStatements()) {
			for (var table : nestedStatement.getTables()) {
				if (table.getName().equalsIgnoreCase(tableName)) {
					selects.add((TSelectSqlStatement) nestedStatement);
				}
			}
		}

		return selects;
	}

	@Override
	public String toString() {
		return parentSelect.toString();
	}

	private TGroupBy getGroupBy(TSelectSqlStatement select) {
		if (select.getGroupByClause() != null) {
			return select.getGroupByClause();
		} else {
			return new TGroupBy();
		}
	}

	public void addGroupByColumn(String column, String table) {
		for (var select : getTableSelects(table)) {
			TGroupByItem groupByItem = new TGroupByItem();
			groupByItem.setExpr(parser.parseExpression(table + "." + column));

			TGroupBy groupBy = getGroupBy(select);
			groupBy.getItems().addGroupByItem(groupByItem);

			select.setGroupByClause(groupBy);
		}

		init(parentSelect.toScript());
	}

	private List<SqlTable> getTables() {
		var tables = new ArrayList<SqlTable>();
		for (var table : parentSelect.getTables()) {
			if ( table.getTableType().name().equalsIgnoreCase("subquery") ) {
				continue;
			}
			tables.add(new SqlTable(table));
		}

		// E.g. with clauses
		for (var nestedStatement : parentSelect.getStatements()) {
			var sqlQuery = new SqlQuery(nestedStatement.toString(), databaseClass);
			tables.addAll(sqlQuery.getTables());
		}

		return tables;
	}

	public Set<String> getTableNames() {
		var tables = new HashSet<String>();
		for (var table : this.getTables()) {
			tables.add(table.getName());
		}

		return tables;
	}

	public SqlTable getTable(String name) {
		for (var table : getTables()) {
			if (table.getName().equalsIgnoreCase(name)) {
				return table;
			}
		}

		return null;
	}

	public String toPrettyString() {
		GFmtOpt option = GFmtOptFactory.newInstance();
		return FormatterFactory.pp(parser, option);
	}

	public boolean hasCte() {
		return parentSelect.getCteList() != null && parentSelect.getCteList().size() > 0;
	}

	public void removeLimit() {
	    parentSelect.setLimitClause(null);
	    init(parentSelect.toString());
	}
	
    public Boolean hasLimit() {
        return parentSelect.getLimitClause() != null;
    }
	
	public void setLimit(Integer limit) {
		if (limit == null) {
			return;
		}	
		
		TLimitClause limitClause;
		if ( parentSelect.getLimitClause() != null ) {
		    limitClause = parentSelect.getLimitClause();
	        limitClause.setString("LIMIT " + limit.toString());
		}
		else {
		    limitClause = new TLimitClause();
	        limitClause.setString(" LIMIT " + limit.toString());
	        parentSelect.setLimitClause(limitClause);
		}
		

		init(parentSelect.toString());
	}

	public void setLimitFrom(SqlQuery query) {
        var parserRowCount = query.parentSelect.getLimitClause().getRow_count();
        setLimit(Integer.parseInt(parserRowCount.toString()));
    }

	@Override
	public Object clone() {
		return new SqlQuery(this.queryText,this.databaseClass);
	}
}
