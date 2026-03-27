package hopara.dataset.column;

public enum ColumnType {
	STRING("text",false),
	INTEGER("integer",true),
	DECIMAL("numeric(24,8)",true),
	JSON("JSONB",false),
	DATETIME("timestamp",false,false,true,false),
	STRING_ARRAY("varchar(255)[]",false,true),
	NULL("fail", false,false),
	GEOMETRY("geometry",false,false,false,true),
	BOOLEAN("boolean",false,false),
	AUTO_INCREMENT("INT GENERATED ALWAYS AS IDENTITY",true,false);
	
	private final String sqlType;
	private final Boolean isQuantitative;
	private final Boolean isArray;
	private final Boolean isTemporal;

	private final Boolean hasSubtype;
	
	ColumnType(String sqlType, Boolean isQuantitative) {
		this.sqlType = sqlType;
		this.isQuantitative = isQuantitative;
		this.isArray = false;
		this.isTemporal = false;
		this.hasSubtype = false;
	}
	
	ColumnType(String sqlType, Boolean isQuantitative,  Boolean isArray) {
		this.sqlType = sqlType;
		this.isQuantitative = isQuantitative;
		this.isArray = isArray;
		this.isTemporal = false;
		this.hasSubtype = true;
	}

	ColumnType(String sqlType, Boolean isQuantitative,  Boolean isArray, Boolean isTemporal, Boolean hasSubtype ) {
		this.sqlType = sqlType;
		this.isQuantitative = isQuantitative;
		this.isArray = isArray;
		this.isTemporal = isTemporal;
		this.hasSubtype = hasSubtype;
	}
	
	public String getSqlType() {
		return sqlType;
	}
	
	public Boolean isQuantitative() {
		return this.isQuantitative;
	}
	
	public Boolean isArray() {
		return this.isArray;
	}

	public Boolean isTemporal() {
		return this.isTemporal;
	}

	public Boolean hasSubtype() {
		return this.hasSubtype;
	}
}

