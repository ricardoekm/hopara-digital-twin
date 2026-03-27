import { PositionEncoding } from '@hopara/encoding'
import { LayerType } from '../../../layer/LayerType'

export class VegaMarkTranslator {
  translate(layerType:LayerType, positionEncoding?:PositionEncoding) : string {
    switch (layerType) {
      case LayerType.bar:
        return 'bar'
      case LayerType.line:
        if (positionEncoding?.hasFirstAxis() && positionEncoding.hasSecondAxis()) {
          return 'line'
        } else {
          return 'rule'
        }
      case LayerType.arc:
        return 'arc'
      case LayerType.circle:
        return 'circle'
      case LayerType.area:
        return 'area'
      case LayerType.rectangle:
        return 'rect'
    }
    
    return 'unknown'
  }
}
