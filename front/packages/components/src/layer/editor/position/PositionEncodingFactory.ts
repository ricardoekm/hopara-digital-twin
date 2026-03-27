import { DataRef, PositionEncoding, PositionType } from '@hopara/encoding'
import { Layer } from '../../Layer'
import { VisualizationType } from '../../../visualization/Visualization'
import { createManagedPositionEncoding } from './PositionAutoFill'

export class PositionEncodingFactory {
  static createFromType(type: PositionType, layer: Layer, visualizationType: VisualizationType, oldPositionEncoding: PositionEncoding): PositionEncoding {
    if (type === PositionType.MANAGED) {
      return createManagedPositionEncoding(
          layer,
          visualizationType,
          layer.getData().getQueryKey(),
        )
    } else if (type === PositionType.REF) {
      return new PositionEncoding({
        ...oldPositionEncoding,
        type: PositionType.REF,
        data: new DataRef(),
      })
    } else {
       return new PositionEncoding({
          ...oldPositionEncoding,
          type: PositionType.CLIENT,
          data: undefined,
          x: undefined,
          y: undefined,
      })
    }
  }
}

