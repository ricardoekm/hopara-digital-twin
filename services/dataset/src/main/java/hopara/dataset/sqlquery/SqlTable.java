package hopara.dataset.sqlquery;

import gudusoft.gsqlparser.nodes.TObjectNameList;
import gudusoft.gsqlparser.nodes.TTable;
import hopara.dataset.SqlSanitizer;

public class SqlTable {
	
	TTable table;
	
	public SqlTable(TTable table) {
		this.table = table;
	}
	
	public String getName() {
		return SqlSanitizer.cleanString(table.getName());
	}
	
	// Used to reference tables that conflicts with database keywords, e.g. default. This will return "default" if scaped in the user query.
	public String getOriginalName() {
		return this.table.getName();
	}	
	
	public TObjectNameList getLinkedColumns() {
	    return this.table.getLinkedColumns();
	}
	
	public void setString(String string) {
	    this.table.setString(string);
	}
	
	public String getAlias() {
		return table.getAliasName();
	}
}
