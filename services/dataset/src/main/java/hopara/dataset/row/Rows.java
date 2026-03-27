package hopara.dataset.row;

import java.util.ArrayList;

import hopara.dataset.column.Columns;

public class Rows extends ArrayList<Row> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public void setValue(String column, Object value) {
		for ( var row : this ) {
			row.setValue(column, value);
		}
	}

	public void castTypes(Columns columns) {
		for(var row : this) {
            row.castTypes(columns);
        }
	}
}
