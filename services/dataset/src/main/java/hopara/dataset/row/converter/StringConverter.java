package hopara.dataset.row.converter;

import hopara.dataset.column.TypeHint;

public class StringConverter implements Converter {

    @Override
    public Object toDatabaseFormat(Object value, TypeHint typeHint) {
        return value;
    }

    @Override
    public Object fromDatabaseFormat(Object value) {
        return value;
    }
    
}
