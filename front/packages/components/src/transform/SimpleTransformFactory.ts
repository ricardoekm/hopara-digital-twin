import { TransformFactory } from './TransformFactory'
import { ClusterTransform } from './ClusterTransform'
import { NeighborCountTransform } from './NeighborCountTransform'
import { PlaceTransform } from './PlaceTransform'
import { Transform, TransformType } from '@hopara/encoding/src/transform/Transform'
import { UnitTransform } from './UnitTransform'
import { GroupByTransform } from './GroupByTransform'

export class SimpleTransformFactory implements TransformFactory {
  create(rawTransform: any): Transform | undefined {
      if (rawTransform.type === TransformType.cluster) {
        return new ClusterTransform(rawTransform.radius)
      } else if (rawTransform.type === TransformType.neighborCount) {
        return new NeighborCountTransform(rawTransform.radius)
      } else if (rawTransform.type === TransformType.place) {
        return new PlaceTransform(rawTransform)
      } else if (rawTransform.type === TransformType.unit) {
        return new UnitTransform(rawTransform)
      } else if (rawTransform.type === TransformType.groupBy) {
        return new GroupByTransform(rawTransform.fields)
      } 

      return undefined
  }  
}
