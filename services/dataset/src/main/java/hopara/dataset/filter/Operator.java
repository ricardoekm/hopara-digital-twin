package hopara.dataset.filter;

public enum Operator {
	GREATER_EQUALS_THAN(">="), 
	GREATER_THAN(">"), 
	LESS_EQUALS_THAN("<="), 
	LESS_THAN("<="), 
	PARTIAL_MATCH("LIKE"), 
	EQUALS("="), 
	NOT_EQUALS("<>"),
	INTERSECTS("ST_Intersects"),
    MAKE_POINT("ST_MakePoint"),
	MAX_X("ST_XMax"),
	MAX_Y("ST_YMax"),
	MIN_X("ST_XMin"),
	MIN_Y("ST_YMin"),
	MIN("MIN"),
	MAX("MAX"),
	IS("IS");
	
	private String sqlOperator;
	
	Operator(String sqlOperator){
		this.sqlOperator = sqlOperator;
	}
	
	public String getSqlOperator() {
		return sqlOperator;
	}
 }
