package hopara.dataset.transform;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import hopara.dataset.column.Columns;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes({
  @JsonSubTypes.Type(value=ClusterTransform.class, name = "CLUSTER"),
  @JsonSubTypes.Type(value=RoomClusterTransform.class, name = "ROOM_CLUSTER"),
  @JsonSubTypes.Type(value=NeighborCountTransform.class, name = "NEIGHBOR_COUNT"),
  @JsonSubTypes.Type(value=UnitTransform.class, name = "UNIT"),
  @JsonSubTypes.Type(value=PlaceTransform.class, name = "PLACE"),
  @JsonSubTypes.Type(value=PlaceAroundTransform.class, name = "PLACE_AROUND"),
  @JsonSubTypes.Type(value=GroupByTransform.class, name = "GROUP_BY")
})
@JsonIgnoreProperties(ignoreUnknown = true)
public abstract class Transform implements Serializable  {
    public abstract TransformType getType();
    public abstract Columns getColumns(Columns viewColumns);
}
