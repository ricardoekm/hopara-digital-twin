import {VegaLiteFactory} from './vega/VegaLiteFactory'
import {Layer} from '../layer/Layer'
import {ViewLayers} from './ViewLayers'
import {createFromLayer, factories, DeckLayerFactoryProps} from './DeckLayerFactory'
import {hasFactory} from './LayerFactory'
import {PositionScales} from '@hopara/encoding/src/position/scale/Scales'
import {ZoomBehavior} from '../view-state/ViewState'
import { InteractionCallbacks } from './deck/interaction/Interaction'
import { Rowsets } from '../rowset/Rowsets'
import { Queries } from '@hopara/dataset'
import { AxesDimensions } from '../chart/domain/AxesDimension'
import { Projector, RowProjector } from '@hopara/projector'
import { isEqual } from 'lodash/fp'

interface ChartLayerFactoryProps extends DeckLayerFactoryProps {
  queries: Queries,
  positionScales: PositionScales
  zoomBehavior?: ZoomBehavior
  callbacks: InteractionCallbacks
  notifyCreate: boolean
  oldDimensions?: AxesDimensions
  oldProjector?: Projector
  onChartCreated: (dimensions: AxesDimensions, projector: Projector) => void
  onChartUpdated: (dimensions: AxesDimensions, projector: Projector) => void
}

function shouldCreate(layer: Layer, rowsets:Rowsets, zoom: number) {
  if (!layer.shouldRender(rowsets)) return false
  if (!layer.isVisible(zoom)) return false

  const rowset = rowsets.getById(layer.getRowsetId())  
  return !!rowset?.rows?.length
}

const vegaLiteFactory = new VegaLiteFactory()

function shouldNotifyUpdate(result, oldDimensions, oldProjector) {
  return !isEqual(result.dimensions, oldDimensions) ||
         !isEqual(result.scales?.x?.domain(), oldProjector?.scales?.x?.domain()) ||
         !isEqual(result.scales?.y?.domain(), oldProjector?.scales?.y?.domain())
}

export const createChart = (layers: Layer[], props: ChartLayerFactoryProps) => {
  const result = vegaLiteFactory.create({
    layers,
    queries: props.queries,
    callbacks: props.callbacks,
    dimensions: props.viewState?.getDimensions(),
    zoom: props.zoom,
    zoomBehavior: props.zoomBehavior,
    positionScales: props.positionScales,
    rowsets: props.rowsets,
    viewState: props.viewState,
    world: props.world,
  })

  if (props.notifyCreate && result.dimensions) {
    props.notifyCreate = false
    props.onChartCreated(result.dimensions, new Projector(result.scales))
  } else if (shouldNotifyUpdate(result, props.oldDimensions, props.oldProjector)) {
    props.onChartUpdated(result.dimensions, new Projector(result.scales))
  }

  return result
}

function isVegaLayer(layer: Layer) {
  return layer.isChart()
}

export const createChartViewLayers = (props: ChartLayerFactoryProps): ViewLayers => {
  const viewLayers = new ViewLayers()

  if (!props.layers || !props.viewState?.dimensions.width) return viewLayers

  const vegaLayers = props.layers.filter((layer) => isVegaLayer(layer) && 
                                                    shouldCreate(layer, props.rowsets, props.zoom))
  if (vegaLayers.length) {
    const chart = createChart(vegaLayers, props)
    viewLayers.push(chart.layers)

    const deckLayers = props.layers.filter((layer) => !isVegaLayer(layer))
    if (deckLayers.length) {
      const rowProjector = new RowProjector(new Projector(chart.scales))
      const deckProps = {...props, rowProjector}
    
      deckLayers.filter(hasFactory(factories))
                .map((layer: Layer) => viewLayers.push(createFromLayer(deckProps, layer)))
    }
  }

  return viewLayers
}


