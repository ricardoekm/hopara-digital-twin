package hopara.dataset.view;

import java.io.Serializable;
import java.util.List;
import java.util.Objects;

import javax.validation.constraints.NotNull;

import org.apache.commons.lang3.SerializationUtils;
import org.springframework.data.annotation.Transient;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import hopara.dataset.SqlSanitizer;
import hopara.dataset.column.Column;
import hopara.dataset.column.Columns;
import hopara.dataset.database.DatabaseClass;
import hopara.dataset.sqlquery.SqlQuery;
import hopara.dataset.table.Table;
import hopara.dataset.table.TableKey;
import hopara.dataset.table.Tables;
import hopara.dataset.transform.NullTransform;
import hopara.dataset.transform.Transform;
import hopara.dataset.transform.TransformFactory;
import io.swagger.v3.oas.annotations.media.Schema;

public class View implements Serializable {
	    
    @Schema(hidden = true)
	private String name;
	
	@NotNull
	private String query;
	private String writeTableName;
    private String primaryKeyName;
    private String versionColumnName;

    @NotNull
    private String dataSourceName;

    @Schema(hidden = true)
    @JsonIgnore
    private DatabaseClass databaseClass;
    
    @Schema(hidden = true)
    @JsonIgnore
    private Integer rowCount;
		
    @Schema(hidden = true)
    private Columns columns = new Columns();	
	private Boolean filterTables = false;
    private Boolean smartLoad;    

    private WriteLevel writeLevel;
    private Boolean upsert = false;
    private Integer SMART_LOAD_THRESHOLD = 2000;
    private String join;
    private String annotation;
	
	@Transient
	private Tables tables = new Tables();

    private List<EditableColumn> editableColumns = new EditableColumns();
	
	public View(String dataSourceName, String name) {
		this.name = name;
        this.dataSourceName = dataSourceName;
	}
	
    public View(String dataSourceName, String name, String query, DatabaseClass databaseClass) {
        this.name = name;
        this.dataSourceName = dataSourceName;
        this.databaseClass = databaseClass;
        setQuery(query);
    }
	
	public View() {}
	
	public void setQuery(String query) {	
		this.query = query;
	}

    public Boolean hasPrimaryKey() {
        return StringUtils.hasText(primaryKeyName);
    }

    public void setRowCount(Integer rowCount) {
        this.rowCount = rowCount;
    }

    // Used in the front end do differentiate js functions and file datasources
    public String getAnnotation() {
        return annotation;
    }

    public void setAnnotation(String annotation) {
        this.annotation = annotation;
    }

    @JsonProperty("versionColumn")
    public void setVersionColumnName(String versionColumnName) {
        this.versionColumnName = versionColumnName;
    }

    @JsonProperty("versionColumn")
    public String getVersionColumnName() {
        return versionColumnName;
    }

    public Boolean hasVersionColumn() {
        return StringUtils.hasText(versionColumnName);
    }

    public Integer getRowCount() {
        return rowCount;
    }

    @Schema(hidden = true)
    public void setDatabaseClass(DatabaseClass databaseClass) {
        this.databaseClass = databaseClass;
    }

    private void validateDatabaseClass() {
        if ( databaseClass == null ) {
            throw new IllegalArgumentException("Database class not yet set!");
        }
    }

    public void validate() {
        validateDatabaseClass();

        var sqlQuery = SqlQuery.validate(query, databaseClass);
		if ( sqlQuery.hasCte() ) {
		    throw new IllegalArgumentException("Views should not have CTEs (WITH ... AS)");
		}

        for ( var editableColumn : getEditableColumns() ) {
            if ( !this.getColumns().contains(editableColumn.getName()) ) {
                throw new IllegalArgumentException("Editable column not found " + editableColumn.getName());
            }
        }
    }
	
	public String getQuery() {
		return query;
	}

    public DatabaseClass getDatabaseClass() {
        return databaseClass;
    }

    @Schema(hidden = true)
    @JsonIgnore
    public String getId() {
        return new ViewKey(dataSourceName, name).getId();
    }

    public Columns getColumns(Transform transform) {
        if ( transform == null || transform instanceof NullTransform) {
            return getColumns();
        }

        return TransformFactory.getFromType(transform.getType()).getColumns(this.getColumns());
    }
	
	@JsonIgnore
	public SqlQuery getSqlQuery() {
        validateDatabaseClass();

	    return new SqlQuery(query, databaseClass);
	}
	
	public void addColumn(Column column) {
		this.columns.add(column);
	}

    public void addColumns(Columns column) {
		this.columns.addAll(column);
	}
	
    public Columns getColumns() {   
        if ( StringUtils.hasText(primaryKeyName) ) {
            if ( columns.contains(primaryKeyName) ) {
                columns.get(primaryKeyName).setPrimaryKey(true);
            }            
        }   

        for ( var editableColumn : getEditableColumns() ) {
            if ( columns.contains(editableColumn.getName()) ) {
                columns.get(editableColumn.getName()).setEditable(true);
            }
        }

        return columns;
    }
    
    private Columns getTableColumns() {
        var tableColumns = new Columns();

        for ( var table : getTables() ) {
            tableColumns.addAll(table.getColumns());
        }
        
        return tableColumns;
    }
	
	@JsonIgnore
	public Columns getAllColumns() {
	    var fullColumns = new Columns();
        fullColumns.addAll(getColumns());        
        fullColumns.addAll(getTableColumns());	    
		return fullColumns;
	}
	
	@JsonProperty
	public void setColumns(Columns columns) {
        this.columns = columns;
    }

    @JsonGetter("filterTables")
    public Boolean shouldFilterTables() {
        if ( this.filterTables == null ) {
            return false;
        }

        return this.filterTables;
    }
    
    public void setFilterTables(Boolean filterTables) {
        this.filterTables = filterTables;
    }
	
	public void setName(String name) {
		this.name = name;
	}

    public void setWriteLevel(WriteLevel writeLevel) {
        this.writeLevel = writeLevel;
    }

    @JsonGetter("upsert")
    public Boolean shouldUpsert() {
        return this.upsert;
    }

    public void setUpsert(Boolean upsert) {
        this.upsert = upsert;
    }

    @JsonProperty
    public void setSmartLoad(Boolean smartLoad) {
        this.smartLoad = smartLoad;
    }

    @JsonIgnore
    public Boolean getSmartLoad() {
        return this.smartLoad;
    }

    @JsonGetter("smartLoad")
    public Boolean shouldSmartLoad() {
        if ( databaseClass == DatabaseClass.MYSQL ) {
            return false;
        }

        if ( smartLoad == null ) {
            if ( rowCount == null ) {
                return false;
            }
            else {
                return rowCount >= SMART_LOAD_THRESHOLD;
            }
        }
        
        return smartLoad;
    }
    
    public WriteLevel getWriteLevel() {
        if ( writeLevel == null ) {
            if ( StringUtils.hasText(writeTableName) && StringUtils.hasText(primaryKeyName) ) {
                return WriteLevel.UPDATE;
            }
            else { 
                return WriteLevel.NONE;
            }
        }

        return writeLevel;
    }

    @JsonIgnore
    public TableKey getWriteTableKey() {
        return new TableKey(this.dataSourceName,this.getWriteTableName());
    }

	public String getName() {
		return this.name;
	}
	
    @JsonProperty("writeTable")
	public void setWriteTableName(String writeTableName) {
        this.writeTableName = writeTableName;
    }
	
    @JsonProperty("writeTable")
	public String getWriteTableName() {
        if ( !StringUtils.hasText(writeTableName) ) {
            if ( this.databaseClass != null ) {
                var sqlQuery = getSqlQuery();
                var tableNames = sqlQuery.getTableNames();
                if ( tableNames.size() == 1 ) {
                    return tableNames.iterator().next();
                }
            }
        }

        return writeTableName;
    }

    public Boolean hasWriteTable() {
        return StringUtils.hasText(getWriteTableName());
    }

    @JsonProperty("dataSource")
    public void setDataSourceName(String dataSourceName) {
        this.dataSourceName = dataSourceName;
    }

    @JsonProperty("dataSource")
    public String getDataSourceName() {
        return dataSourceName;
    }

    @JsonProperty("primaryKey")
    public void setPrimaryKeyName(String primaryKey) {
        this.primaryKeyName = primaryKey;
    }

    @JsonProperty("primaryKey")
    public String getPrimaryKeyName() {
        return primaryKeyName;
    }

    @JsonIgnore
    public Column getPrimaryKeyColumn() {
        return getColumns().get(primaryKeyName);
    }

    public boolean hasColumns() {
        return this.columns.size() > 0;
    }
    
    @Override
    public String toString() {
        return this.dataSourceName + "#" + this.name;
   }

    public void setTables(Tables tables) {
        this.tables = tables;
    }
    
    public void addTable(Table table) {
        this.tables.add(table);
    }
    
    @JsonIgnore
    public Tables getTables() {
        return tables;
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, dataSourceName);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        View other = (View) obj;
        return Objects.equals(name, other.name) &&
                Objects.equals(dataSourceName, other.dataSourceName);
    }

    public View clone(String name) {
        View view = new View("hopara",name, query, databaseClass);
        view.setColumns(columns);
        view.setWriteTableName(writeTableName);
        return view;
    }

    // To fix tables with same name referenced in the query
    @JsonIgnore
    public String getQueryName() {
        // Identifiers in Postgres cannot start with numbers so we always prefix with underscore
        return SqlSanitizer.cleanString("_" + this.getName());
    }

    public String getQueryName(String suffix) {
        return  getQueryName() + "_" + suffix;
    }

    public View clone() {
        var view = new View(dataSourceName,name,query, databaseClass);
        view.setPrimaryKeyName(primaryKeyName);
        view.setWriteTableName(writeTableName);
        view.setWriteLevel(writeLevel);
        view.setUpsert(view.shouldUpsert());
        view.setSmartLoad(smartLoad);
        view.setFilterTables(filterTables);
        view.setColumns(columns);
        view.setFilterTables(filterTables);
        view.setTables(tables);
        view.setRowCount(rowCount);
        view.setVersionColumnName(versionColumnName);
        return view;
    }

    public void setLimit(Integer limit) {
        var query = getSqlQuery();
        if ( !query.hasLimit() ) {
            query.setLimit(limit);
            setQuery(query.toString());
        }
    }

    public View cloneWithUniqueName() {
        // To avoid conflict with same name table when creating the cte query
        var view = SerializationUtils.clone(this);
		view.setName("random_prefix_" + getName());
        return view;
    }

    @JsonIgnore
    public ViewKey getKey() {
        return new ViewKey(dataSourceName, name);
    }

    @JsonProperty("editableColumns")
    public void setEditableColumns(List<EditableColumn> editableColumns) {
        this.editableColumns = editableColumns;
    }

    @JsonProperty("editableColumns")
    public List<EditableColumn> getEditableColumns() {
        if ( editableColumns == null ) {
            return new EditableColumns();
        }

        return editableColumns;
    }

    public String getJoin() {
        return join;
    }

    public void setJoin(String join) {
        this.join = join;
    }

    public Boolean hasJoin() {
        return StringUtils.hasText(join);
    }
}
