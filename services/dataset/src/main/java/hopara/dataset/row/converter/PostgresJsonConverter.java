package hopara.dataset.row.converter;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.postgresql.util.PGobject;

import com.fasterxml.jackson.databind.ObjectMapper;

import hopara.dataset.column.TypeHint;

public class PostgresJsonConverter implements Converter {
    private Log logger = LogFactory.getLog(PostgresJsonConverter.class);

    protected ObjectMapper objectMapper;    
    
    public PostgresJsonConverter(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public Object toDatabaseFormat(Object value, TypeHint typeHint) {
        try {
            if ( value != null ) {
                return objectMapper.writeValueAsString(value);
            }               
        } catch(Exception e) {
            logger.error("Unable to serialize " + value);
            return null;
        }   
        
        return value;
    }

    public Object toDatabaseFormat(Object value) {
        return toDatabaseFormat(value, null);
    }

    protected Object parseJson(String jsonString) {
        try {
            return objectMapper.readValue(jsonString, Object.class);          
        } catch(Exception e ) {
            logger.warn("Could not parse " + jsonString, e);
            return null;
        }
    }

    private String getJsonString(Object value) {
        if ( value instanceof PGobject ) {
            return ((PGobject)value).getValue();
        }

        return value.toString();
    }

    @Override
    public Object fromDatabaseFormat(Object value) {
        if ( value == null ) {
            return value;
        }

        return parseJson(getJsonString(value));
    }

    @SuppressWarnings({ "unchecked" , "rawtypes"})
    public Object fromDatabaseFormat(Object value, Class clazz) {
        if ( value == null ) {
            return value;
        }

        var jsonString = getJsonString(value);
        try {
            return objectMapper.readValue(jsonString, clazz);          
        } catch(Exception e ) {
            logger.warn("Could not parse " + jsonString, e);
            return null;
        }
    }
}
