package hopara.dataset.table;

import java.util.HashSet;

public class Tables extends HashSet<Table> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public boolean contains(String name) {
		return get(name) != null;
	}
	
	public Table get(String name) {
		for ( var source : this ) {
			if ( source.hasSameName(name) ) {
				return source;
			}
		}
		
		return null;
	}
}
