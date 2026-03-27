package hopara.dataset.column;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import hopara.dataset.SqlSanitizer;
import hopara.dataset.database.Database;
import hopara.dataset.position.PositionColumns;
import hopara.dataset.stats.column.ColumnStats;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
@JsonPropertyOrder(alphabetic = true)
public class Column implements Serializable {
    private Log log = LogFactory.getLog(Column.class);
    
	public static ColumnType DEFAULT_TYPE = ColumnType.STRING;
	
    private String name;
    private ColumnType type;
	private Boolean primaryKey = false;
    private ColumnStats stats;
	private Boolean isEditable = false;
    private String defaultValue;
    private Boolean notNull = false;

	Boolean quoteIdentifiers = false;

    public Column() {}
    
    public Column(String name) { setName(name); }
    
    public Column(String name, ColumnType type) { 
        setName(name); 
        this.type = type; 
    }

    public Column(String name, ColumnType type, Boolean notNull) { 
        setName(name); 
        this.type = type; 
        this.notNull = notNull;
    }

    public Column(String name, ColumnType type, String defaultValue) { 
        setName(name); 
        this.type = type; 
        this.defaultValue = defaultValue;
    }

    public String getDefaultValue() {
        return defaultValue;
    }

    public String getName() {
        return SqlSanitizer.cleanString(name);
    }

	public Boolean hasSameName(String name) {
		return this.name.equalsIgnoreCase(name);
	}

	@JsonIgnore
    private String getQuotedName() {
        return "\"" + SqlSanitizer.basicCleanString(this.name) + "\"";
    }
	
	@JsonIgnore
	public void setQuoteIdentifiers(Boolean quoteIdentifiers) {
		this.quoteIdentifiers = quoteIdentifiers;
	}

	@JsonIgnore
	public Boolean getQuoteIdentifiers() {
		return quoteIdentifiers;
	}

    @JsonIgnore
    public String getSqlName() {
        if ( this.quoteIdentifiers ) {
            return getQuotedName();
        } 
        else {
            return getName();
        }
    }

	@JsonProperty("name")
	public String getOriginalName() {
		return SqlSanitizer.basicCleanString(name);
	}

	@JsonProperty("isEditable")
	public void setEditable(Boolean isEditable) {
		this.isEditable = isEditable;
	}

	@JsonProperty("isEditable")
	public Boolean isEditable() {
		return isEditable;
	}

	public TypeHint getTypeHint() {
		if ( this.hasSameName(PositionColumns.LINE_COLUMN_NAME) ) {
			return TypeHint.LINE;
		}
		else if ( this.hasSameName(PositionColumns.POINT_2D_COLUMN_NAME) ) {
			return TypeHint.POINT;
		}

		return TypeHint.NONE;
	}
    
    public String getQualifiedName(String prefix) {
        return prefix + "." + getName();
    }
    
    public void setName(String name) {
		if ( name.contains(";") || name.contains("\"") ) {
			throw new IllegalColumnNameException(name);
		}
		this.name = name;
	}

	public Column setPrimaryKey(Boolean id) {
		this.primaryKey = id;
        return this;
	}

	public Boolean getPrimaryKey() {
		return primaryKey;
	}
    
    public ColumnType getType() {
    	if ( this.type == null ) {
    		return DEFAULT_TYPE;
    	}
    	
		return type;
	}
    
    public Boolean hasTypeDefined() {
        return this.type != null;
    }
    
    @JsonGetter
    public Boolean isQuantitative() {
    	return getType().isQuantitative();
    }

	@JsonGetter
    public Boolean isTemporal() {
    	return getType().isTemporal();
    }
    
    public Boolean isType(ColumnType type) {
    	return this.getType() == type;
    }
    
    public void setType(ColumnType type) {
		this.type = type;
	}
    
    public void setType(String type) {
    	try {
    		this.type = ColumnType.valueOf(type.toUpperCase());
    	} catch(IllegalArgumentException e ) {
    		log.warn("Unknown type " + type + ". Setting default");
    		this.type = DEFAULT_TYPE;
    	}
	}
    
    @JsonIgnore
    public Boolean isListValueValid() {
        return getType().isArray() || getType().isQuantitative() || isType(ColumnType.JSON) || isType(ColumnType.GEOMETRY);
    }
		
	public void setStats(ColumnStats stats) {
		this.stats = stats;
	}
	
	public ColumnStats getStats() {
		return stats;
	}
	
	@JsonIgnore
	public String getDDL(Database database) {
		var ddl = getName() + " " + database.getSqlType(getType());
	    if ( primaryKey ) {
			return ddl + " PRIMARY KEY";
		}
        
        if ( defaultValue != null ) {
            ddl += " DEFAULT " + defaultValue;
        }

        if ( notNull ) {
            ddl += " NOT NULL";
        }

		return ddl;
	}
	
	@Override
	public String toString() {
		return this.name;
	}
}
