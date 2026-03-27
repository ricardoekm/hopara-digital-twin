import { Layer } from './Layer'
import { LayerType } from './LayerType'

export function isLayerVisible(layer:Layer, zoom: number, editLayerId?: string) {
  if ( layer.isType(LayerType.polygon) && layer.getId() === editLayerId ) {
    return true
  }
  
  return layer.isVisible(zoom)
}
