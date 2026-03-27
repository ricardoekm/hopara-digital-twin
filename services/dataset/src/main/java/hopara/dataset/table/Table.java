package hopara.dataset.table;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import hopara.dataset.SqlSanitizer;
import hopara.dataset.column.Column;
import hopara.dataset.column.Columns;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
public class Table implements Serializable {
    String name;
    Columns columns = new Columns();

    @NotNull
    String dataSourceName;

    Boolean quoteIdentifiers = false;
   
    public Table() {
    }

    public Table(String dataSourceName, String name) {
        setName(name);
        this.dataSourceName = dataSourceName;
    }

    public Table(String name) {
        setName(name);
    }

    public String getName() {
        return SqlSanitizer.cleanString(this.name);
    }

    public Boolean hasSameName(String name) {
		return this.name.equalsIgnoreCase(name);
	}

    @JsonIgnore
    private String getQuotedName() {
        return "\"" + getName() + "\"";
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
    
    public void setName(String name) {
        this.name = name;
    }

    public String getId() {
        return new TableKey(dataSourceName, name).getId();
    }

    @JsonIgnore
    public Columns getColumns() {
        return columns;
    }

    public void addColumns(Columns columnsToAdd) {
        columns.addAll(columnsToAdd);
    }

    public void addColumn(String columnName) {
        addColumn(new Column(columnName));
    }

    public void addColumn(Column column) {
        columns.add(column);
    }

    @JsonProperty("dataSource")
    public void setDataSourceName(String dataSourceName) {
        this.dataSourceName = dataSourceName;
    }

    @JsonProperty("dataSource")
    public String getDataSourceName() {
        return dataSourceName;
    }

    public Boolean hasColumn(String columnName) {
        return columns.contains(columnName);
    }

    public void setQuoteIdentifiers(Boolean quoteIdentifiers) {
        this.quoteIdentifiers = quoteIdentifiers;
    }

	@JsonIgnore
    public Boolean getQuoteIdentifiers() {
        return quoteIdentifiers;
    }

    @JsonProperty
    public void setColumns(Columns columns) {
        this.columns = columns;
    }

    public String toString() {
        return this.dataSourceName + "#" + this.name;
    }
    
    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((name == null) ? 0 : name.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Table other = (Table) obj;
        if (name == null) {
            return other.name == null;
        }
        return name.equals(other.name);
    }

    @JsonIgnore
    public Columns getFilterColumns() {
        return columns;
    }

    @JsonIgnore
    public TableKey getKey() {
        return new TableKey(dataSourceName, name);
    }

    public List<String> getMissingColumns(List<String> columnNames) {
        var missingColumns = new ArrayList<String>();
        for ( var columnName : columnNames ) {
            if ( !hasColumn(columnName) ) {
                missingColumns.add(columnName);
            }
        }
        return missingColumns;
    }
}
