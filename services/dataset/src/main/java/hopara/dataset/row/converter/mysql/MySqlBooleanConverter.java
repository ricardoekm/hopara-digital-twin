package hopara.dataset.row.converter.mysql;

import hopara.dataset.column.TypeHint;
import hopara.dataset.row.converter.BooleanConverter;

public class MySqlBooleanConverter implements BooleanConverter {

    @Override
    public Object toDatabaseFormat(Object value, TypeHint typeHint) {
        return value;
    }

    @Override
    public Object fromDatabaseFormat(Object value) {
        if ( value == null ) {
            return null;
        }
        // MySql uses 0/1 for boolean
        return value.equals(1);
    }    
}
