package hopara.dataset.row.converter.duckdb;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.Map;

import org.duckdb.DuckDBStruct;
import org.duckdb.JsonNode;

import com.fasterxml.jackson.databind.ObjectMapper;

import hopara.dataset.column.TypeHint;
import hopara.dataset.row.converter.PostgresJsonConverter;

public class DuckJsonConverter extends PostgresJsonConverter {
    public DuckJsonConverter(ObjectMapper objectMapper) {
        super(objectMapper);
    }

    @Override
    public Object toDatabaseFormat(Object value, TypeHint typeHint) {
        return value;
    }

    private Map<String, Object> toMap(DuckDBStruct struct) {
        try {
            var map = struct.getMap();
            map.forEach((k, v) -> {
                if ( v instanceof DuckDBStruct ) {
                    map.put(k, toMap((DuckDBStruct)v));
                }
            });
            return map;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Object fromDatabaseFormat(Object value) {
        if ( value instanceof String ) {
            var stringValue = (String)value;
            stringValue = stringValue.replaceAll(": NULL", ": null");
            return parseJson(stringValue);
        }
        else if ( value instanceof JsonNode ) {
            var node = (JsonNode)value;
            if ( node.isString() ) {
                return node.toString().replaceAll("^\"|\"$", "");
            }
            else if ( node.isNumber() ) {
                return new BigDecimal(node.toString());
            } 
            else if ( node.isObject()) {
                return parseJson(node.toString());
            }
        }
        else if ( value instanceof DuckDBStruct ) {
            return toMap((DuckDBStruct)value);
        }

        return value.toString();
    }
}
