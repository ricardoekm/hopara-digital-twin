import { isEmpty } from 'lodash/fp'
import { Layer } from '../layer/Layer'
import { Layers } from '../layer/Layers'
import { Rowsets } from '../rowset/Rowsets'
import { Legends } from './Legends'

function isLegendCandidate(layer:Layer, legends:Legends) {
  const legend = legends.find((legend) => legend.layer === layer.getId())
  if (!layer.canCreateLegend() && isEmpty(legend?.items)) {
    return false
  }

  return true
}

function getLegendCandidates(layers:Layers, legends:Legends, rowsets:Rowsets) : Layers {
  const renderableLayers = layers.renderable(rowsets)
  const candidateLayers = renderableLayers.filter((layer) => isLegendCandidate(layer, legends))
  return new Layers(...candidateLayers)
}

export function getLegendLayer(layers:Layers, legends:Legends, rowsets:Rowsets) : Layer | undefined {
  const candidateLayers = getLegendCandidates(layers, legends, rowsets)
  for (const legend of legends) {
    const layer = candidateLayers.find((layer) => layer.getId() === legend.layer) 
    if (layer) {
      return layer
    }    
  }

  return undefined
}
