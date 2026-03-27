package hopara.dataset.transform;

public class TransformFactory {
    public static Transform getFromType(TransformType type) {
        if ( type == TransformType.CLUSTER ) {
            return new ClusterTransform();
        }
        else if ( type == TransformType.ROOM_CLUSTER ) {
            return new RoomClusterTransform();
        }
        else if ( type == TransformType.GROUP_BY ) {
            return new GroupByTransform();
        }
        else if ( type == TransformType.UNIT ) {
            return new UnitTransform();
        } 
        else if ( type == TransformType.NEIGHBOR_COUNT) {
            return new NeighborCountTransform();
        }
        else if ( type == TransformType.PLACE ) {
            return new PlaceTransform();
        }
        else if ( type == TransformType.PLACE_AROUND ) {
            return new PlaceAroundTransform();
        }

        return new NullTransform();
    }

    public static Transforms getAll() {
        var transforms = new Transforms();
        for ( var type : TransformType.values() ) {
            transforms.add(getFromType(type));
        }
        return transforms;
    }
}
