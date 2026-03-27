import { throttle } from 'lodash/fp'
import { createChartViewLayers } from '../../view-layer/ChartLayerFactory'
import { ViewLayers } from '../../view-layer/ViewLayers'
import { PositionScaleFactory } from '../../world/PositionScaleFactory'
import DeckView from '../DeckView'
import OrthographicView from '../deck/OrthographicView'

export class ChartViewComponent extends DeckView {
  notifyCreate = true
  oldDimensions = undefined
  oldProjector = undefined
  notifyUpdateThrottled: any

  constructor(props) {
    super(props)
    this.notifyUpdateThrottled = throttle(300, props.onChartUpdated)
  }

  handleChartCreated(dimensions, projector) {
    this.notifyCreate = false
    this.props.onChartCreated?.(dimensions, projector)
  }


  handleChartUpdated(dimensions, projector) {
    this.oldDimensions = dimensions
    this.oldProjector = projector
    this.notifyUpdateThrottled?.(dimensions, projector)
  }

  doGetViewLayers(): ViewLayers {
    const positionScales = PositionScaleFactory.fromLayers(this.props.layers, this.props.queries)
    const deckViewLayerProps = this.getFactoryProps()

    return createChartViewLayers({
      ...deckViewLayerProps,
      positionScales,
      zoomBehavior: this.props.viewState?.zoomBehavior,
      onChartUpdated: this.handleChartUpdated.bind(this),
      onChartCreated: this.handleChartCreated.bind(this),
      queries: this.props.queries,
      notifyCreate: this.notifyCreate,
      oldDimensions: this.oldDimensions,
      oldProjector: this.oldProjector,
    })
  }

  getViews() {
    if (!this.props.world) return []

    const viewPortProps = this.props.viewState?.getOrtographicViewPortProps()
    const yAxisWidth = (this.props.axesDimensions?.y.width ?? 0)
    const xAxisHeight = (this.props.axesDimensions?.x.height ?? 0)

    return [
      new OrthographicView({
        ...viewPortProps,
        flipY: true,
        id: 'vega-background',
        controller: false,
        fixedX: true,
        fixedY: true,
        translationMatrix: [
          yAxisWidth ? -1 : 0,
          xAxisHeight ? xAxisHeight - 1 : 0,
          0,
        ],
      }),
      new OrthographicView({
        ...viewPortProps,
        flipY: true,
        id: 'vega-axes-y',
        controller: false,
        fixedX: true,
        height: viewPortProps.height - xAxisHeight,
        translationMatrix: [
          0,
          xAxisHeight ? (xAxisHeight / 2) : 0,
          0,
        ],
      }),
      new OrthographicView({
        ...viewPortProps,
        flipY: true,
        id: 'vega-axes-y-lines',
        controller: false,
        fixedX: true,
        height: viewPortProps.height - xAxisHeight,
        translationMatrix: [
          0,
          xAxisHeight ? (xAxisHeight / 2) : 0,
          0,
        ],
      }),
      new OrthographicView({
        ...viewPortProps,
        flipY: true,
        id: 'vega-axes-x',
        controller: false,
        fixedY: true,
        width: viewPortProps.width,
        translationMatrix: [
          0,
          xAxisHeight ? xAxisHeight : 0,
          0,
        ],
      }),
      new OrthographicView({
        ...viewPortProps,
        flipY: true,
        id: 'vega-axes-x-lines',
        controller: false,
        fixedY: true,
        x: yAxisWidth,
        width: viewPortProps.width - yAxisWidth,
        translationMatrix: [
          -(yAxisWidth / 2),
          xAxisHeight ? xAxisHeight : 0,
          0,
        ],
      }),
      new OrthographicView({
        ...viewPortProps,
        flipY: true,
        id: 'main-view',
        x: yAxisWidth,
        width: viewPortProps.width - yAxisWidth,
        height: viewPortProps.height - xAxisHeight,
        limitNavigation: true,
        controller: this.getViewController(),
        axesDimensions: this.props.axesDimensions,
        translationMatrix: [
          -(yAxisWidth / 2),
          xAxisHeight ? (xAxisHeight / 2) : 0,
          0,
        ],
      }),
    ]
  }

  viewLayerFilter = ({layer, viewport}) => {
    if (!(layer.props as any).targetView && viewport.id === 'main-view') return true
    return (layer.props as any).targetView === viewport.id
  }
}
