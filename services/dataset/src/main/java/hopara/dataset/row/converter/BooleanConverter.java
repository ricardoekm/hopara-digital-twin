package hopara.dataset.row.converter;

public interface BooleanConverter extends Converter {
    public Object fromDatabaseFormat(Object value);
}
