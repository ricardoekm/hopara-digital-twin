package hopara.pg;

import java.sql.Array;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.List;


public class SqlArrayToList {
	public static List<Object> convert(Array sqlArray) {
		if ( sqlArray == null ) {
			return null;
		}

		try {
			var array = (Object[])sqlArray.getArray();
			return Arrays.asList(array);
		} catch (SQLException e) {
			throw new RuntimeException(e);
		}
	}
}
