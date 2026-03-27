package hopara.dataset.row.converter.duckdb;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import java.math.BigDecimal;
import java.util.Map;

import org.duckdb.JsonNode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.core.JsonParser.Feature;
import com.fasterxml.jackson.databind.ObjectMapper;

import static hopara.dataset.test.Assert.assertNumberEquals;;

public class DuckJsonConverterTest {

    DuckJsonConverter jsonConverter;

    @BeforeEach
    public void setup() {
        var objectMapper = new ObjectMapper();
        objectMapper.configure(Feature.ALLOW_SINGLE_QUOTES, true);

        jsonConverter = new DuckJsonConverter(objectMapper);
    }
    
    @Test
    public void removes_enclosing_quotes() {
        var jsonNode = new JsonNode("\"abc\"");

        assertEquals("abc", jsonConverter.fromDatabaseFormat(jsonNode));
    }

    @Test
    public void parse_numbers() {
        var jsonNode = new JsonNode("123");

        assertEquals(new BigDecimal(123), jsonConverter.fromDatabaseFormat(jsonNode));
    }

    @Test
    @SuppressWarnings("rawtypes")
    public void parse_string() {
        var string = "{'temperature': -76.14, 'co2': NULL, 'o2': NULL}";
        var parsed = (Map)jsonConverter.fromDatabaseFormat(string);
        assertNumberEquals(new BigDecimal("-76.14"), parsed.get("temperature"));
        assertNull(parsed.get("co2"));
        assertNull(parsed.get("o2"));
    }
}
