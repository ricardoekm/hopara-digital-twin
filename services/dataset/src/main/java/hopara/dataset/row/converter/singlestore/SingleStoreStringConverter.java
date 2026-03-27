package hopara.dataset.row.converter.singlestore;

import hopara.dataset.row.converter.StringConverter;

public class SingleStoreStringConverter extends StringConverter {
    @Override
    public Object fromDatabaseFormat(Object value) {
        if ( value != null ) {
            if ( value instanceof String ) {
                return value;
            }
            else {
                return new String((byte[])value);
            }            
        }        

        return value;
    }
}
