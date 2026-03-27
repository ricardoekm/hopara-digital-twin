import {parse as VegaParse, View as VegaView} from 'vega'
import {memoize} from '@hopara/memoize'
import {sceneToStage} from './stagers/SceneToStage'
import ViewState, {ZoomBehavior} from '../../view-state/ViewState'
import { DataComparator } from '../DataComparator'
import { Dimensions } from '@hopara/spatial'
import { InteractionCallbacks } from '../deck/interaction/Interaction'
import { SpecFactory } from './SpecFactory'
import { Layer } from '../../layer/Layer'
import { VegaTranslator } from './translator/VegaTranslator'
import { Condition, PositionScales } from '@hopara/encoding'
import { Columns, Queries, Rows } from '@hopara/dataset'
import { VegaLayer } from './VegaLayer'
import { Rowsets } from '../../rowset/Rowsets'
import { createChartLayers } from './layers/group/ChartLayersFactory'
import { createAxesDomainLayers, createAxesTicksLayers } from './layers/group/AxisLayersFactory'
import { createFacetLayers } from './layers/group/FacetLayersFactory'
import { enrichRows } from './RowEnricher'
import { getAxesDimensions } from './AxesDimensionFactory'
import { AxesDimensions } from '../../chart/domain/AxesDimension'
import { RowProcessor } from '../row/RowProcessor'
import { World } from '../../world/World'
import { filterVisibleRows } from '../row/RowVisibility'

const dataComparator = new DataComparator()
const chartDataCacheStore = new Map()
const enrichCacheStore = new Map()
const specFactory = new SpecFactory()
const translator = new VegaTranslator()

export interface VegaViewLayerProps {
  layers: Layer[]
  queries: Queries,
  dimensions?: Dimensions
  zoomBehavior?: ZoomBehavior
  positionScales: PositionScales
  rowsets: Rowsets
  zoom: number
  callbacks: InteractionCallbacks
  viewState?: ViewState
  world?: World
}

export class VegaLiteFactory {
  getStage(view: VegaView): any {
    return sceneToStage(view.scenegraph())
  }

  getVegaView(props: VegaViewLayerProps, vegaLayers: VegaLayer[], axedDimensions?:AxesDimensions) {
    const spec = specFactory.create({
      layers: vegaLayers,
      dimensions: props.dimensions,
      zoomBehavior: props.zoomBehavior,
      zoom: props.zoom,
      axesDimensions: axedDimensions,
    })

    const runtime = VegaParse(spec)
    const view = new VegaView(runtime)

    return view.run()
  }

  doGetChartData(props: VegaViewLayerProps, layers: VegaLayer[]) {
    const view = this.getVegaView(props, layers)
    const axesDimensions = getAxesDimensions(this.getStage(view))
    // We need to recompile vega with the adjusted Hopara axes
    const adjustedView = this.getVegaView(props, layers, axesDimensions)
    const stage = this.getStage(adjustedView)
    const scales = (adjustedView as any)._runtime.scales

    return {
      stage,
      scales: { x: scales.x?.value, y: scales.y?.value },
      axesDimensions,
    }
  }

  getChartData(props: VegaViewLayerProps, layers: VegaLayer[], cacheKey: string) {
    return memoize(this.doGetChartData.bind(this), {
        cacheStore: chartDataCacheStore,
        cacheKey,
     })(props, layers)
  }

  translate(layer:Layer, rowsets:Rowsets, queries: Queries, positionScales:PositionScales, rowProcessor:RowProcessor) {
    const query = queries.findQuery(layer.getQueryKey())

    let rows = rowsets.getById(layer.getRowsetId())?.rows as Rows
    rows = filterVisibleRows(rows, layer.visible.condition as Condition)
    rows = rowProcessor.processRows({rows, columns: query?.getColumns() as Columns, 
                                     visible: layer.visible, lastModified: layer.getLastModified(), 
                                     transform: layer.getTransform(), filterPlaced: !layer.isChart()})
    
    const cacheKey = rows.getEtagValue() + layer.getId() + layer.getRowsetId()
    const memoizedEnrichRows = memoize(enrichRows, {cacheKey, cacheStore: enrichCacheStore})
    rows = memoizedEnrichRows(rows, layer.getId(), layer.getRowsetId())

    return translator.translate(layer, rows, query, positionScales)
  }

  doCreate(props: VegaViewLayerProps, vegaLayers:VegaLayer[], cacheKey: string, zoomCacheKey: string) {
    const chartData = this.getChartData(props, vegaLayers, zoomCacheKey)
    const stage = chartData.stage

    if (!stage) {
      return {}
    }

    const factoryProps = {cacheKey, dataComparator, callbacks: props.callbacks, rowsets: props.rowsets}
    const chartLayers = createChartLayers(stage, factoryProps)

    const axesProps = {cacheKey: zoomCacheKey, dataComparator, callbacks: props.callbacks, targetView: 'vega-axes', rowsets: props.rowsets}
    const axesTicksLayers = createAxesTicksLayers(stage, axesProps)
    const axesXTicksLayers = axesTicksLayers.length > 1 ? axesTicksLayers[0].flat() : []
    const axesYTicksLayers = axesTicksLayers.length > 1 ? axesTicksLayers[1].flat() : []
    const facetLayers = createFacetLayers(stage, {...factoryProps, targetView: 'vega-background'})
    const axesDomainLayers = createAxesDomainLayers(stage, {...axesProps, targetView: 'vega-background'})
    const layers = [
      ...facetLayers,
      ...axesDomainLayers,
      ...axesXTicksLayers,
      ...axesYTicksLayers,
      ...chartLayers,
    ] 

    return { layers, dimensions: chartData.axesDimensions, scales: chartData.scales }
  }

  getCacheKeyValue(layerKey:string, dimensions: Dimensions) {
    return `${layerKey}#${dimensions?.height}#${dimensions?.width}`
  }

  getLayerKey(key: any, layer: VegaLayer): string {
    return `${key}-${layer.name}#${layer.lastModified?.getTime() ?? 'never-modified'}#${layer.data.values.getEtagValue()}`
  }

  getZoomCacheKey(layers:VegaLayer[], zoom:number, dimensions:Dimensions) {
    const zoomKey = (zoom ?? 0).toFixed(0)
    const layerKey = layers.reduce((key, layer) => {
      return `${this.getLayerKey(key, layer)}#${zoomKey}`
    }, '')

    return this.getCacheKeyValue(layerKey, dimensions)
  }

  getCacheKey(layers:VegaLayer[], dimensions:Dimensions) {
    const layerKey = layers.reduce((key, layer) => {
      return `${this.getLayerKey(key, layer)}`
    }, '')

    return this.getCacheKeyValue(layerKey, dimensions)
  }

  create(props: VegaViewLayerProps) {
    if (!props.dimensions) return {}

    const rowProcessor = new RowProcessor(props.viewState, props.world)
    const vegaLayers = props.layers.map((layer) => this.translate(layer, props.rowsets, props.queries, 
                                                                  props.positionScales, rowProcessor)).flat()
    const zoomCacheKey = this.getZoomCacheKey(vegaLayers, props.zoom, props.dimensions)
    const cacheKey = this.getCacheKey(vegaLayers, props.dimensions)
    return this.doCreate(props, vegaLayers, cacheKey, zoomCacheKey)
  }
}
