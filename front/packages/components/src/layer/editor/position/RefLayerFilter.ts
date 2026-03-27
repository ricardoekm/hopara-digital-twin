import { PositionType } from '@hopara/encoding'
import { Layer } from '../../Layer'
import { LayerType } from '../../LayerType'

export function getRefLayerFilter(selectedLayer: Layer) {
  return (layer: Layer) => {
    if ( layer.getId() === selectedLayer.getId() || !layer.hasPosition() ) {
      return false
    }

    if ( layer.getPositionEncoding()?.isOfType(PositionType.REF) ) {
      return false
    }

    if ( selectedLayer.isCoordinatesBased() ) {
      if ( layer.type === selectedLayer.type ) {
        return true
      }

      if ( selectedLayer.type === LayerType.polygon ) {
        return layer.type === LayerType.image
      }

      return false
    }

    return true
  } 
}
