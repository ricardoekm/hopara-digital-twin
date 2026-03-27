import { Layer } from 'deck.gl'
import { Stage } from '../../stagers/SceneToStage'
import { createArcLayer } from '../ArcLayerFactory'
import { createCircleLayer } from '../CircleLayerFactory'
import { createPathLayer } from '../PathLayerFactory'
import { createPolygonLayer } from '../PolygonLayerFactory'
import { createTextLayer } from '../TextLayerFactory'
import { FactoryProps } from '../BaseFactory'
import { DetailsCallbackFactory } from '../../../deck/interaction/DetailsCallbackFactory'
import { RowsetRowTranslator } from '../../RowsetRowTranslator'
import { newVegaCubeLayer } from '../VegaCubeLayerFactory'

const layerIds = {
  text: 'VEGA_LAYER_TEXT',
  paths: 'VEGA_LAYER_PATHS',
  polygons: 'VEGA_LAYER_POLYGONS',
  circles: 'VEGA_LAYER_CIRCLES',
  arcs: 'VEGA_LAYER_ARCS',
  cube: 'VEGA_LAYER_CUBE',
}

export function createChartLayers(stage: Stage, props:FactoryProps): Layer<any>[] {
  const rowsetRowTranslator = new RowsetRowTranslator(props.rowsets)
  const callbacks = DetailsCallbackFactory.createCallbacks(props.callbacks, {} as any, rowsetRowTranslator)

  const textLayer = createTextLayer(layerIds.text, stage.text as any, props, callbacks)
  const polygonLayer = createPolygonLayer(layerIds.polygons, stage.polygon as any, props, callbacks)
  const pathLayer = createPathLayer(layerIds.paths, stage.path as any, props)
  const circleLayer = createCircleLayer(layerIds.circles, stage.circle as any, props, callbacks)
  const arcLayer = createArcLayer(layerIds.arcs, stage.arcs as any, props, callbacks)
  const cubeLayer = newVegaCubeLayer(layerIds.cube, stage.cube as any, props, callbacks)

  return [
    textLayer, pathLayer, polygonLayer, circleLayer, arcLayer, cubeLayer,
  ] as any
}
