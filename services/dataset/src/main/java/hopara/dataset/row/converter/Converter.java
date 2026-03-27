package hopara.dataset.row.converter;

import hopara.dataset.column.TypeHint;

public interface Converter {
    Object toDatabaseFormat(Object value, TypeHint typeHint);
    Object fromDatabaseFormat(Object value);
}
