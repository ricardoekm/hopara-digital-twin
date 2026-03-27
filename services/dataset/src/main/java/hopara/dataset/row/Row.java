package hopara.dataset.row;

import java.util.Date;
import java.util.Map;

import org.springframework.util.LinkedCaseInsensitiveMap;

import com.fasterxml.jackson.databind.ObjectMapper;

import hopara.dataset.column.ColumnType;
import hopara.dataset.column.Columns;
import hopara.dataset.time.DateParser;

public class Row {
    Map<String,Object> values = new LinkedCaseInsensitiveMap<>();
    static ObjectMapper objectMapper = new ObjectMapper();
    
    private Object id;
    
    public Row() { }

    @SuppressWarnings("unchecked")
    public Row(Object values) {
        if ( values instanceof Map ) {
            this.values.putAll((Map<String,Object>)values);
        }
        else {
            this.values.putAll(objectMapper.convertValue(values, Map.class));
        }
    }
    
    public Row(Number id, Object values) {
        this(values);
        this.id = id;
    }

    
    protected Double convertToDouble(Object object) {
        if ( object instanceof Number ) {
            return ((Number) object).doubleValue();
        } 
        else if ( object instanceof String ) {
            try {
                return Double.parseDouble((String)object);
            } catch(Exception e ) { }
        }
        else if ( object instanceof Date ) {
            var date = (Date) object;
            return (double)date.getTime();        
        }
        
        return null;
    }
    
    protected Integer convertToInteger(Object object) {
        if ( object instanceof Number ) {
            return ((Number) object).intValue();
        } 
        else if ( object instanceof String ) {
            try {
                return Integer.parseInt((String)object);
            } catch(Exception e ) { }
        }
        
        return null;
    }
    
    public Boolean hasValue(String key) {
        return this.getValues().containsKey(key);
    }
    
    public Object getValue(String column) {
        return getValues().get(column);
    }

    public Boolean hasColumn(String column) {
        return values.containsKey(column);
    }
    
    public void setValue(String column, Object value) {
        this.values.put(column, value);
    }

    public void deleteValue(String column) {
        this.values.remove(column);
    }
    
    public Double getDouble(String column) {
        return convertToDouble(getValue(column));
    }

    public Map<String, Object> getValues() {
        return values;
    }

    private Date numberToTime(Number value) {
        return new Date(value.longValue());
    }
    
    private Date stringToTime(String value) {
        try {
            return DateParser.parse(value);
        } catch(Exception e) {
            try {
                // Number sent as string?
                var longValue = Long.parseLong(value);
                return numberToTime(longValue);
            } catch(Exception e2) {}
            
            throw e;                 
        }       
    }

    
    protected Date convertToTime(Object object) {
        if ( object instanceof Date ) {
            return (Date)object;
        }
        else if ( object instanceof String ) {
            return stringToTime((String)object);
        }
        else if ( object instanceof Number ) {
            return numberToTime((Number) object);
        }
        
        return null;
    }
    
    public void setId(Object id) {
        this.id = id;
    }
    
    public Object getId() {
        return id;
    }

    public void castTypes(Columns columns) {
        for ( var column : columns.filterType(ColumnType.DATETIME)) {
            if ( hasValue(column.getName()) ) {
                setValue(column.getName(), convertToTime(getValue(column.getName())));
            }
        }  
    }

    public Row clone() {
        var clonedRow = new Row();
        clonedRow.values.putAll(this.values);
        clonedRow.id = this.id;
        return clonedRow;
    }
}
