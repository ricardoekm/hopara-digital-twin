package hopara.dataset.row.converter;

import hopara.dataset.column.TypeHint;

public interface ArrayConverter extends Converter {
    public Object toDatabaseFormat(Object value, TypeHint typeHint);
    public Object fromDatabaseFormat(Object value);
}
