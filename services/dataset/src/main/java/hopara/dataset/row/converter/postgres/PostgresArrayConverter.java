package hopara.dataset.row.converter.postgres;

import java.sql.Array;
import java.util.HashSet;
import java.util.List;

import hopara.dataset.column.TypeHint;
import hopara.dataset.row.converter.ArrayConverter;
import hopara.pg.SqlArrayToList;

public class PostgresArrayConverter implements ArrayConverter {
    
    @SuppressWarnings("unchecked")
    public Object toDatabaseFormat(Object value, TypeHint typeHint) {
        if ( value != null ) {
            if ( value instanceof List ) {
                var list = (List<String>)value;
                // So postgres driver knows the type
                return list.toArray(new String[list.size()]);

            }
            else if ( value instanceof HashSet ) {
                var hashSet = (HashSet<String>)value;
                return hashSet.toArray(new String[hashSet.size()]);
            }
        }
        
        return null;
    }
    
    @Override
    public Object fromDatabaseFormat(Object value) {
        return SqlArrayToList.convert((Array)value);
    }  
}
