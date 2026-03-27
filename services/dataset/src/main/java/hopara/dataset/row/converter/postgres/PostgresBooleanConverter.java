package hopara.dataset.row.converter.postgres;
import hopara.dataset.column.TypeHint;
import hopara.dataset.row.converter.BooleanConverter;

public class PostgresBooleanConverter implements BooleanConverter {

    @Override
    public Object toDatabaseFormat(Object value, TypeHint typeHint) {
        return value;
    }

    @Override
    public Object fromDatabaseFormat(Object value) {
        // Postgres rules
        return value;
    }
}
