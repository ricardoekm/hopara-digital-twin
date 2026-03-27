import { Layer } from '../layer/Layer'
import { LayerType } from '../layer/LayerType'
import { DefaultTransform } from './DefaultTransform'
import { ImageTransform } from './ImageTransform'
import { LineTransform } from './LineTransform'
import { Transform } from './Transform'
import { PolygonTransform } from './PolygonTransform'

export class PlaceTransformFactory {
  static createFromLayer(layer:Layer) : Transform {
    if (layer.isType(LayerType.image)) {
      if (layer.encoding.image) {
        return new ImageTransform(layer.encoding.image)
      }
    }

    if (layer.hasType(LayerType.polygon)) {
      const polygonField = layer.encoding.position?.coordinates?.field
      if (polygonField) {
        return new PolygonTransform(polygonField)
      }    
    }

    if (layer.isType(LayerType.line)) {
      const lineField = layer.encoding.position?.coordinates?.field
      if (lineField) {
        return new LineTransform(lineField)
      }    
    }
    
    return new DefaultTransform()
  }
}
