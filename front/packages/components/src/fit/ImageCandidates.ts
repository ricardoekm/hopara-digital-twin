import { isNil } from 'lodash'
import { Layers } from '../layer/Layers'
import { LayerType } from '../layer/LayerType'

export function getImageCandidates(layers:Layers, targetLayerZoom?:number, targetLayerIndex?:number) {
  return layers.slice(0, targetLayerIndex) 
               .filter((layer) => layer.type === LayerType.image && 
                       layer.visible.value && 
                       (!targetLayerZoom || isNil(layer.visible.zoomRange.max?.value) || layer.visible!.zoomRange!.max!.value > targetLayerZoom))
               .reverse()
}
