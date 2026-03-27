package hopara.dataset.row.converter.postgres;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;

import hopara.dataset.column.TypeHint;

public class PostgresNumberArrayConverter extends PostgresArrayConverter {   
    
    // https://stackoverflow.com/questions/25149412/how-to-convert-listt-to-array-t-for-primitive-types-using-generic-method
    public static <P> P toPrimitiveArray(List<?> list, Class<P> arrayType) {
        if (!arrayType.isArray()) {
            throw new IllegalArgumentException(arrayType.toString());
        }
        Class<?> primitiveType = arrayType.getComponentType();
        if (!primitiveType.isPrimitive()) {
            throw new IllegalArgumentException(primitiveType.toString());
        }

        P array = arrayType.cast(Array.newInstance(primitiveType, list.size()));

        for (int i = 0; i < list.size(); i++) {
            Array.set(array, i, list.get(i));
        }

        return array;
    }
    
    @SuppressWarnings("unchecked")
    @Override
    public Object toDatabaseFormat(Object value, TypeHint typeHint) {
        var list = new ArrayList<Double>();
        if ( value != null && value instanceof Iterable ) {
            var iteratable = (Iterable<Number>)value;
            for ( var item : iteratable ) {
                list.add(item.doubleValue());
            }
            
            return toPrimitiveArray(list, double[].class);
        }
        
        return null;
    }
}
