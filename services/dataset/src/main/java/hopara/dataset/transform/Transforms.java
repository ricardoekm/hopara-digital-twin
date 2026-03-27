package hopara.dataset.transform;

import java.util.ArrayList;

public class Transforms extends ArrayList<Transform> {
	public Transform get(TransformType type) {
		for ( var transform : this ) {
			if ( transform.getType() == type ) {
				return transform;
			}
		}
		
		return null;
	}
	
	public Boolean contains(TransformType type) {
		return get(type) != null;
	}

    @Override
	public boolean add(Transform transform) {
        if ( !this.contains(transform.getType()) ) {
			return super.add(transform);
		}

        return false;
    }
}
