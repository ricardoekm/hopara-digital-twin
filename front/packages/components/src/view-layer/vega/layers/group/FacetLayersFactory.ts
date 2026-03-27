import { Layer } from 'deck.gl'
import { LineData } from '../../marks/line'
import { createLineLayer } from '../LineLayerFactory'
import { Stage } from '../../stagers/SceneToStage'
import { FactoryProps } from '../BaseFactory'

const layerIds = {
  lines: 'VEGA_LAYER_LINES',
}

export function createFacetLayers(stage: Stage, props: FactoryProps): Layer<any>[] {
  if (!stage.facets) return []
  const lines:LineData[] = []
  stage.facets.forEach((f) => {
    if (f.lines) lines.push.apply(lines, f.lines)
  })

  const facetLineLayer = createLineLayer('FACET_' + layerIds.lines, lines, props)
  return [facetLineLayer]
}
