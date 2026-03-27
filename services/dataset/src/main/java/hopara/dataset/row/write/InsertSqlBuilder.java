package hopara.dataset.row.write;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import hopara.dataset.column.Column;
import hopara.dataset.column.ColumnType;
import hopara.dataset.column.Columns;
import hopara.dataset.database.Database;
import hopara.dataset.database.DatabaseClass;
import hopara.dataset.row.Row;
import hopara.dataset.row.Rows;
import hopara.dataset.table.IndexRepository;
import hopara.dataset.table.Table;

@Component
public class InsertSqlBuilder extends WriteSqlBuilder {
	
	@Autowired
	IndexRepository indexRepository;
	
	@Autowired
	Database database;
	
	private String getColumnsClause(Columns columns) {   
		return String.join(",", columns.getNames());	
	}

	private String getValuesClause(Columns columns) {			
		var valuesPlaceholder = new ArrayList<String>();
		for ( var column : columns ) {
			if ( column.isType(ColumnType.GEOMETRY)) {
	             valuesPlaceholder.add(getGeometryPlaceholder(column.getName()));
			}
			else if ( column.isType(ColumnType.JSON) ) {
				valuesPlaceholder.add(getJsonPlaceholder(column.getName()));
			}
			else {
				valuesPlaceholder.add(getPlaceholder(column.getName()));
			}			
		}
		return String.join(",", valuesPlaceholder);		
	}
	
    private String getConflictClause(Table table) {               
        if ( database.isClass(DatabaseClass.POSTGRES) ) {
              return " ON CONFLICT DO NOTHING";
        }

		return "";
    }

	public String getBaseQuery(Table table,List<Row> rows) {
		var columns = table.getColumns();
		if ( columns.size() == 0 ) {
			throw new IllegalArgumentException("No columns found for table " + table);
		}

		if ( rows.size() == 0 ) {
			throw new IllegalArgumentException("No rows to insert " + table);
		}

		// Some columns we shouldnt write (e.g. auto-increment columns).
		// So we'll consider the columns in the first row.
		columns = columns.getIntersection(rows.get(0).getValues().keySet());
		if ( columns.size() == 0 ) {
			return "INSERT INTO " + table.getSqlName() + " DEFAULT VALUES";
		}

        return "INSERT INTO " + table.getSqlName() + 
				"(" + getColumnsClause(columns) + ")" + 
				" VALUES (" + getValuesClause(columns) + ") ";
	}

	public String getQuery(Table table,List<Row> rows) {
		return getBaseQuery(table, rows) + getConflictClause(table);
	}

	private String getReturningClause(Column selectColumn) {
		return " RETURNING " + selectColumn.getName();
	}

	public String getQuery(Table table,Rows rows,Column selectColumn) {
		return getBaseQuery(table, rows) + getReturningClause(selectColumn);
	}
}
