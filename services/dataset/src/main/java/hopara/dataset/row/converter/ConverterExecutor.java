package hopara.dataset.row.converter;

import java.util.Map;

import hopara.dataset.column.ColumnType;
import hopara.dataset.column.Columns;
import hopara.dataset.row.Row;

public class ConverterExecutor {
    Columns jsonColumns;
    Columns arrayColumns;
    Columns geometryColumns;
    Columns dateColumns;
    Columns booleanColumns;
    Columns stringColumns;
    
    Converter jsonConverter;
    ArrayConverter arrayConverter;
    GeometryConverter geometryConverter;
    DateConverter dateConverter;
    BooleanConverter booleanConverter;
    StringConverter stringConverter;
    
    public ConverterExecutor(Columns columns) {
        // Small optimization, 1-2% found in profiling.
        jsonColumns = columns.filterType(ColumnType.JSON);
        arrayColumns = columns.filterType(ColumnType.STRING_ARRAY);
        geometryColumns = columns.filterType(ColumnType.GEOMETRY);
        dateColumns = columns.filterType(ColumnType.DATETIME);
        booleanColumns = columns.filterType(ColumnType.BOOLEAN);
        stringColumns = columns.filterType(ColumnType.STRING);
    }

    public void setStringConverter(StringConverter stringConverter) {
        this.stringConverter = stringConverter;
    }
    
    public void setJsonConverter(Converter jsonConverter) {
        this.jsonConverter = jsonConverter;
    }
    
    public void setArrayConverter(ArrayConverter arrayConverter) {
        this.arrayConverter = arrayConverter;
    }
    
    public void setBooleanConverter(BooleanConverter booleanConverter) {
        this.booleanConverter = booleanConverter;
    }
    
    public void setGeometryConverter(GeometryConverter geometryConverter) {
        this.geometryConverter = geometryConverter;
    }
    
    public void setDateConverter(DateConverter dateConverter) {
        this.dateConverter = dateConverter;
    }
    
    private Map<String, Object> executeFromDatabaseFormat(Map<String, Object> row, Converter converter, Columns columns) {
        for ( var column : columns ) {
            var value = row.get(column.getOriginalName());       
            if ( value != null ) {
                row.put(column.getName(), converter.fromDatabaseFormat(value));
            }                  
        }

        return row;
    }

    private Row executeToDatabaseFormat(Row row, Converter converter, Columns columns) {
        for ( var column : columns ) {
            if ( row.hasColumn(column.getName()) ) {
                var value = (Object)row.getValue(column.getName());
                row.setValue(column.getName(), converter.toDatabaseFormat(value, column.getTypeHint()));  
            }
        }

        return row;
    }


    public Map<String, Object> fromDatabaseFormat(Map<String, Object> row) {
        executeFromDatabaseFormat(row, jsonConverter,jsonColumns);
        executeFromDatabaseFormat(row, arrayConverter,arrayColumns);
        executeFromDatabaseFormat(row, geometryConverter,geometryColumns);
        executeFromDatabaseFormat(row, dateConverter,dateColumns);
        executeFromDatabaseFormat(row, booleanConverter,booleanColumns);
        executeFromDatabaseFormat(row, stringConverter,stringColumns);

        return row;
    }   
      
    public Row toDatabaseFormat(Row row) {
        row = row.clone();
        
        executeToDatabaseFormat(row, jsonConverter,jsonColumns);
        executeToDatabaseFormat(row, arrayConverter,arrayColumns);
        executeToDatabaseFormat(row, geometryConverter,geometryColumns);
        executeToDatabaseFormat(row, dateConverter,dateColumns);
        executeToDatabaseFormat(row, booleanConverter,booleanColumns);
        executeToDatabaseFormat(row, stringConverter,stringColumns);

        return row;
    }  
}
