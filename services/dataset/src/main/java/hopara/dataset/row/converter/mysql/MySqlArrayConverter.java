package hopara.dataset.row.converter.mysql;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import hopara.dataset.column.TypeHint;
import hopara.dataset.row.converter.ArrayConverter;

public class MySqlArrayConverter implements ArrayConverter {
    
    @Autowired
    private ObjectMapper objectMapper;
    
    public MySqlArrayConverter() {    }
    
    public MySqlArrayConverter(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;        
    }
    
    public Object toDatabaseFormat(Object value, TypeHint typeHint) {
        if ( value != null  && value instanceof Iterable ) {
            try {
                return objectMapper.writeValueAsString(value);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        }
        
        return null;
    }  
    
    protected String getStringValue(Object array) {
        return (String)array;
    }

    @Override
    public Object fromDatabaseFormat(Object value) {
        var array = value;
        if ( array != null ) {
            try {
                return objectMapper.readValue(getStringValue(array), List.class);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        }
        return null;
    }
}
