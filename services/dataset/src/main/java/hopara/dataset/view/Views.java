package hopara.dataset.view;

import java.util.HashSet;

public class Views extends HashSet<View>  {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public boolean contains(ViewKey viewKey) {
		return get(viewKey) != null;
	}
	
	public View get(ViewKey viewKey) {
		for ( var source : this ) {
			if ( source.getName().equals(viewKey.getName()) 
				&& source.getDataSourceName().equals(viewKey.getDataSourceName())) {
				return source;
			}
		}
		
		return null;
	}
}
