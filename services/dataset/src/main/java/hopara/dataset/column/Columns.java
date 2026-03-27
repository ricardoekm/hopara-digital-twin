package hopara.dataset.column;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;

import hopara.dataset.database.Database;

public class Columns extends ArrayList<Column> {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public Columns() { }
	
	public Columns(Columns columns) {
	    super(columns);
	}

    public List<String> getNames() {
        var names = new ArrayList<String>();

        for (var column: this) {
        	names.add(column.getName());
        }

        return names;
    }
    
    public List<String> getQualidifedNames(String prefix) {
        var names = new ArrayList<String>();

        for (var column: this) {
            names.add(column.getQualifiedName(prefix));
        }

        return names;
    }
	
	public Columns filterType(ColumnType type) {
		var columns = new Columns();
		
		for (var column : this) {
			if ( column.isType(type) ) {
				columns.add(column);
			}
		}

		return columns;
	}

	public Boolean hasType(ColumnType type) {
		var columns = filterType(type);
		return columns.size() > 0;
	}
	
	public Columns getNominal() {
       var columns = new Columns();
        
        for (var column : this) {
            if ( !column.isQuantitative() && !column.isTemporal() ) {
                columns.add(column);
            }
        }

        return columns;
	}

	public Columns getQuantitative() {
		var columns = new Columns();
		 
		 for (var column : this) {
			 if ( column.isQuantitative() ) {
				 columns.add(column);
			 }
		 }
 
		 return columns;
	 }
	
	public Column get(String name) {
		for ( var column : this ) {
			if ( column.hasSameName(name) ) {
				return column;
			}
		}
		
		return null;
	}
	
	public Boolean contains(String name) {
		return get(name) != null;
	}
	
	@Override
	public boolean add(Column column) {
		if ( !this.contains(column.getName()) ) {
			return super.add(column);
		}
		
		var currentColumn = get(column.getName());
		if ( !currentColumn.hasTypeDefined() && column.hasTypeDefined() ) {
		    currentColumn.setType(column.getType());		    
		    return true;
		}
		
		return false;
	}
	
	@Override
	public boolean addAll(Collection<? extends Column> columns) {
		for ( var column : columns ) {
			this.add(column);
		}
		
		return true;
	}

    public ColumnType getType(String columnName) {
        var column = this.get(columnName);
        if ( column == null ) {
            return ColumnType.NULL;
        }
        
        return column.getType();
    }
    
    public List<String> getDDLs(Database database) {
        var ddls = new ArrayList<String>();
        for ( var column : this ) {
            ddls.add(column.getDDL(database));
        }
        
        return ddls;
    }

    public Columns getIntersection(Set<String> names) {
		var columns = new Columns();
		var iterator = names.iterator();
		while(iterator.hasNext()) {
			var name = iterator.next();
			if ( this.contains(name) ) {
				columns.add(this.get(name));
			}
		}

        return columns;
    }
}
