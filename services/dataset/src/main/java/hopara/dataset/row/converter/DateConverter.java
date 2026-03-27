package hopara.dataset.row.converter;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

import hopara.dataset.column.TypeHint;

public class DateConverter implements Converter {

    @Override
    public Object toDatabaseFormat(Object value, TypeHint typeHint) {
        return value;
    }

    private Date convertLocalDate(LocalDate localDate) {
        return Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
    }
    
    @Override
    public Object fromDatabaseFormat(Object value) {
        if ( value != null ) {
            if ( value instanceof LocalDate ) {
                value = convertLocalDate((LocalDate)value);
            }

            var castedValue = (Date)value;
            return (double)castedValue.getTime();
        }

        return value;
    }

}
