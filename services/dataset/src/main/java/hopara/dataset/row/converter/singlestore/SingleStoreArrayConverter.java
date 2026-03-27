package hopara.dataset.row.converter.singlestore;

import java.sql.Clob;
import java.sql.SQLException;

import com.fasterxml.jackson.databind.ObjectMapper;

import hopara.dataset.row.converter.mysql.MySqlArrayConverter;

public class SingleStoreArrayConverter extends MySqlArrayConverter {
    public SingleStoreArrayConverter(ObjectMapper objectMapper) {
        super(objectMapper);
    }

    @Override
    protected String getStringValue(Object array) {
        if ( array instanceof Clob) {
            var clob = (Clob)array;
            try {
                return clob.getSubString(1, (int) clob.length());
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
        }       

        return (String)array;
    }
}
