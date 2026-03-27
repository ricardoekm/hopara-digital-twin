 
import {PickingInfo} from '@deck.gl/core/typed'
import DeckGL from '@deck.gl/react/typed'
import {Queries, Row, Rows} from '@hopara/dataset'
import {PureComponent} from '@hopara/design-system/src/component/PureComponent'
import {Authorization} from '@hopara/authorization'
import {DebouncedFunc} from 'lodash'
import {debounce} from 'lodash/fp'
import React from 'react'
import MapGL from 'react-map-gl/maplibre'
import {APIProvider, Map as GoogleMap} from '@vis.gl/react-google-maps'
import {Layers} from '../layer/Layers'
import {RowsetStore} from '../rowset/RowsetStore'
import {ViewController} from '../view-controller/ViewController'
import {ViewLayers} from '../view-layer/ViewLayers'
import ViewState from '../view-state/ViewState'
import Visualization from '../visualization/Visualization'
import {World} from '../world/World'
import {createViewLayers, DeckLayerFactoryProps} from '../view-layer/DeckLayerFactory'
import {EditModeStore} from '../view-layer/ViewLayerStore'
import {DetailsInteractionInfo, InteractionCallbacks, InteractionInfo} from '../view-layer/deck/interaction/Interaction'
import {AxesDimensions} from '../chart/domain/AxesDimension'
import {Projector} from '@hopara/projector'
import {RowSelection} from '../view-layer/deck/interaction/RowSelection'
import {RowEdit} from '../view-layer/deck/interaction/RowEdit'
import {Box, Dimensions} from '@hopara/spatial'
import OrbitViewport from './deck/OrbitViewport'
import {OrthographicViewport} from './deck/OrthographicViewport'
import WebMercatorViewport from './deck/WebMercatorViewport'
import {EditableGeoJsonLayer} from 'nebula.gl'
import {LineLayer} from '../view-layer/deck/factory/LineFactory/LineLayer'
import {ScenegraphLayer} from 'deck.gl'
import {PolygonLayer} from '@deck.gl/layers'
import {createMapViewLayer} from '../view-layer/MapLayerFactory'
import {MapStyle} from '@hopara/encoding'
import {Lights} from '../lights/Lights'
import {ResourceType, ResourceHistory} from '@hopara/resource'
import IconManager from '../view-layer/deck/factory/IconFactory/IconManager'
import {Config} from '@hopara/config'
import {GOOGLE_MAPS_MAX_ZOOM_RANGE, MapStyleSource} from '../map/MapStyleFactory'
import { ZoomRange } from '../zoom/ZoomRange'
import { Grid } from '../grid/Grid'
import { ResourceGenerateState, ResourceUploadState } from '../resource/ResourceStore'
import MultiBitmapLayer from '../view-layer/deck/factory/ImageFactory/MultiBitmapLayer'

const DECK_EVENT_TYPES = [
  'click',
  'pointermove',
  'panstart',
  'panmove',
  'panend',
]

export type StateProps = {
  queries: Queries
  rowsetStore: RowsetStore
  visualization?: Visualization
  layers: Layers
  viewController?: ViewController
  world?: World
  mapStyle?: MapStyle
  axesDimensions?: AxesDimensions
  rowSelection?: RowSelection
  lockedRowsetIds: string[]
  viewState?: ViewState
  authorization: Authorization
  resourceUploadState?: ResourceUploadState[]
  resourceGenerateState?: ResourceGenerateState[]
  imageHistory?: ResourceHistory
  modelHistory?: ResourceHistory
  editingMode: EditModeStore
  webGLMaxTextureSize: number
  isOnObjectEditor: boolean
  isOnLayerEditor: boolean
  isOnSettingsEditor: boolean
  editAccentColor: string
  lights?: Lights
  rowCrop?: any
  hasGoogleMapLayer: boolean
  grids?: Grid[]
}

export type ActionProps = {
  onLayerHover: (info: DetailsInteractionInfo) => void
  onLayerClick: (info?: DetailsInteractionInfo) => void
  onLayerDragEnd: (info: InteractionInfo) => void
  onLayerDragStart: (info: InteractionInfo) => void
  onCropEditEnd: (info: InteractionInfo) => void
  onResourceDownloadProgressChange: (key: string, entity: ResourceType, progress?: number) => void

  onChartCreated: (dimensions: AxesDimensions, projector: Projector) => void
  onChartUpdated: (dimensions: AxesDimensions, projector: Projector) => void

  onViewLoad: (viewport: OrbitViewport | OrthographicViewport | WebMercatorViewport, dimensions: Dimensions) => void
  onViewZooming: (event: any, viewState?: ViewState) => void
  onViewHover: (info: any) => any
  onViewClick: (info: any) => any
  onViewDragStart: (info: any) => any
  onViewDragEnd: (info: any, deckViewState: any) => any
  onViewResize: (viewport: OrbitViewport | OrthographicViewport | WebMercatorViewport, dimensions: Dimensions) => any
}

export type ViewProps = StateProps & ActionProps

type State = {
  isHoveringLayer: boolean
  isViewDragging: boolean
  rowEdit?: RowEdit
  rowHovering?: RowEdit
  viewState?: ViewState
  fetchResourceLastModified?: Date
  cursor?: string | null
}

class DeckView extends PureComponent<ViewProps, State> {
  deckgl: React.RefObject<any>
  viewLayerCache: Map<string, any>
  visualizationId?: string
  renderMap: boolean
  previousViewLayers: ViewLayers
  usePreviousViewLayers: boolean
  previousLastModified: number
  previousRows: { [layerId: string]: Rows }
  viewLayerFilter?: (args: { layer, viewport }) => boolean
  onViewZoomingDebounced: DebouncedFunc<(e: any, viewState?: ViewState) => void>
  zoomStep = 0.5
  mapRef = React.createRef<any>()
  onViewResizeDebounced: DebouncedFunc<(dimensions: Dimensions) => any>
  isEvenHandlerRegistered = false
  iconManager: IconManager

  constructor(props: ViewProps) {
    super(props)
    this.state = {
      isHoveringLayer: false,
      isViewDragging: false,
      fetchResourceLastModified: new Date(),
    }

    this.viewLayerCache = new Map
    this.deckgl = React.createRef<any>()
    this.visualizationId = props.visualization?.id
    this.renderMap = false
    this.previousRows = {}
    this.onViewZoomingDebounced = debounce(500, (e, viewState) => {
      return props.onViewZooming && props.onViewZooming(e, viewState)
    })
    this.onViewResizeDebounced = debounce(300, (dimensions) => this.onViewResize(dimensions))
    this.iconManager = new IconManager(this.props.webGLMaxTextureSize)
  }

  updateFetchResourceLastModified() {
    this.setState({fetchResourceLastModified: new Date()})
  }

  isEditingRow() {
    return !!this.state.rowEdit
  }

  getCursor(state) {
    if (this.state.cursor) return this.state.cursor
    const rowSelection = this.state.rowEdit || this.props.rowSelection
    if (rowSelection && this.isEditingRow()) return 'grabbing'
    else if (!rowSelection && state.isDragging) return 'grabbing'
    else if (this.state.isHoveringLayer) return 'pointer'
    return 'default'
  }

  onUpdateCursor(cursor) {
    this.setState({cursor})
  }

  shouldUseViewStateFromProps(): boolean {
    return !!this.props.viewState &&
      this.props.viewState?.visualizationId === this.visualizationId &&
      this.props.viewState?.isNewerThan(this.state.viewState)
  }

  viewStateWithGoogleRange(viewState: ViewState): ViewState {  
    if (this.props.hasGoogleMapLayer && viewState?.zoom > GOOGLE_MAPS_MAX_ZOOM_RANGE) {
      // Don't do this at home, kids
      viewState.zoomRange = new ZoomRange({
        min: viewState.zoomRange.min,
        max: {value: GOOGLE_MAPS_MAX_ZOOM_RANGE},
      })
    }

    return viewState
  }                     

  getViewState(): ViewState {
    if (this.shouldUseViewStateFromProps()) {
      return this.viewStateWithGoogleRange(this.props.viewState!)
    }
    return this.viewStateWithGoogleRange(this.state.viewState!)
  }

  onLayerHover(info): boolean {
    if (!info && this.state.isHoveringLayer) this.setState({isHoveringLayer: false, rowHovering: undefined})
    else if (info && !this.state.isHoveringLayer) this.setState({isHoveringLayer: true})

    if (this.props.isOnObjectEditor && !!info) {
      this.setState({
        rowHovering: {
          layerId: info.layerId,
          parentId: info.parentId,
          rowsetId: info.rowsetId,
          row: info.row,
          cursorDisplacement: info.cursorDisplacement,
          editType: info.editType,
        },
      })
    }
    
    this.props.onLayerHover(info)
    return true // notify deckgl that we handled the event
  }

  onLayerClick(info): boolean {
    this.props.onLayerClick(info)
    return true // notify deckgl that we handled the event
  }

  onLayerDrag(info) {
    if (!info || !info.editable || !this.props.isOnObjectEditor) return
    this.setState({
      rowEdit: {
        layerId: info.layerId,
        parentId: info.parentId,
        rowsetId: info.rowsetId,
        row: new Row({...info.row, _coordinates: info.rowCoordinates}),
        cursorDisplacement: info.cursorDisplacement,
        editType: info.editType,
      },
    })
    return true // notify deckgl that we handled the event
  }

  onLayerDragStart(info) {
    if (!info || !info.editable || !this.props.isOnObjectEditor) return
    if (this.props.isOnObjectEditor && info?.editable) {
      this.setState({
        rowEdit: {
          layerId: info.layerId,
          parentId: info.parentId,
          rowsetId: info.rowsetId,
          row: new Row({...info.row, _coordinates: info.rowCoordinates}),
          cursorDisplacement: info.cursorDisplacement,
          editType: info.editType,
        },
      }, () => {
        this.props.onLayerDragStart(info)
      })
    }
    return true // notify deckgl that we handled the event
  }

  onLayerDragEnd(info) {
    if (this.props.onLayerDragEnd) this.setState({rowEdit: undefined}, () => this.props.onLayerDragEnd(info))
    return true // notify deckgl that we handled the event
  }

  onLayerEditStart(info) {
    this.onLayerDragStart(info)
    return true // notify deckgl that we handled the event
  }

  onLayerEdit(info) {
    this.onLayerDrag(info)
    return true // notify deckgl that we handled the event
  }

  onLayerEditEnd(info) {
    this.onLayerDragEnd(info)
    return true // notify deckgl that we handled the event
  }

  getZoom(): number {
    return Number(this.props.viewState?.zoom.toFixed(2))
  }

  getBearing(): number {
    return this.props.viewState?.bearing ?? 0
  }

  getVisibleWorld(): Box | undefined {
    return this.props.viewState?.getVisibleWorld()
  }

  getWorldDimensions(): Dimensions | undefined {
    return this.props.viewState?.getDimensions()
  }

  getInteractionCallbacks(): InteractionCallbacks {
    return {
      onClick: this.onLayerClick.bind(this),
      onDrag: this.onLayerDrag.bind(this),
      onHover: this.onLayerHover.bind(this),
      onDragStart: this.onLayerDragStart.bind(this),
      onDragEnd: this.onLayerDragEnd.bind(this),
      onEditStart: this.onLayerEditStart.bind(this),
      onEdit: this.onLayerEdit.bind(this),
      onEditEnd: this.onLayerEditEnd.bind(this),
      onUpdateCursor: this.onUpdateCursor.bind(this),
      onCropEdit: (info) => {
        this.setState({
          rowEdit: {
            layerId: info!.layerId,
            parentId: info!.parentId,
            rowsetId: info!.rowsetId,
            row: info!.row,
            cropGeometry: (info as any)!.bounds,
            editType: info!.editType,
          },
        })
      },
      onCropEditEnd: (info) => {
        this.setState({
          rowEdit: undefined,
        }, () => info && this.props.onCropEditEnd && this.props.onCropEditEnd(info))
      },
    }
  }

  getFactoryResourceProps() {
    return {
      authorization: this.props.authorization,
      maxTextureSize: this.props.webGLMaxTextureSize,
      resourceUploadState: this.props.resourceUploadState,
      resourceGenerateState: this.props.resourceGenerateState,
      imageHistory: this.props.imageHistory,
      modelHistory: this.props.modelHistory,
      onResourceDownloadProgressChange: this.props.onResourceDownloadProgressChange,
    }
  }

  getRowEdit() {
    if (this.props.rowCrop?.bounds && !this.state.rowEdit) {
      return {
        layerId: this.props.rowCrop.layerId,
        rowsetId: this.props.rowCrop.rowsetId,
        row: this.props.rowCrop.row,
        cropGeometry: this.props.rowCrop.bounds,
      }
    }
    return this.state.rowEdit
  }

  getFactoryProps(): DeckLayerFactoryProps {
    return {
      resource: this.getFactoryResourceProps(),
      layers: this.props.layers,
      queries: this.props.queries,
      rowsets: this.props.rowsetStore.getRowsets(),
      rowSelection: this.props.rowSelection,
      rowEdit: this.getRowEdit(),
      rowHovering: this.state.rowHovering,
      viewState: this.props.viewState,
      world: this.props.world,
      zoom: this.getZoom(),
      editingMode: this.props.editingMode,
      callbacks: this.getInteractionCallbacks(),
      isOnObjectEditor: this.props.isOnObjectEditor,
      isOnLayerEditor: this.props.isOnLayerEditor,
      isOnSettingsEditor: this.props.isOnSettingsEditor,
      lockedRowsetIds: this.props.lockedRowsetIds,
      editAccentColor: this.props.editAccentColor,
      iconManager: this.iconManager,
      grids: this.props.grids,
      animationFps: this.props.visualization?.animationFps
    }
  }

  wasLayerModified(): boolean {
    return !!this.previousLastModified && this.previousLastModified !== this.props.layers.getMostRecentLastModified()
  }

  // this method is overridden by ChartViewComponent
  doGetViewLayers(): ViewLayers {
    return createViewLayers(this.getFactoryProps())
  }

  getViewLayers(): ViewLayers {
    if (this.usePreviousViewLayers && this.previousViewLayers && !this.wasLayerModified()) {
      return this.previousViewLayers
    } else if (!this.getViewState().viewport) {
      return new ViewLayers()
    }

    const viewLayers = this.doGetViewLayers()
    this.previousViewLayers = viewLayers
    this.previousLastModified = this.props.layers.getMostRecentLastModified()

    return viewLayers
  }

  getZoomDirection(event): 'in' | 'out' {
    const oldValue = event.oldViewState?.zoom
    const currentValue = event.viewState?.zoom
    if ((currentValue - oldValue) > 0) return 'in'
    return 'out'
  }

  nextZoomStep(zoom: number): number {
    if (Number.isInteger(zoom)) return zoom + this.zoomStep
    return Math.ceil(zoom * (1 / this.zoomStep)) / (1 / this.zoomStep)
  }

  prevZoomStep(zoom: number): number {
    if (Number.isInteger(zoom)) return zoom - this.zoomStep
    return Math.floor(zoom * (1 / this.zoomStep)) / (1 / this.zoomStep)
  }

  hasReachedZoomThreshold(event): boolean {
    if (this.getZoomDirection(event) === 'in') {
      const stateNextStep = this.nextZoomStep(event.oldViewState?.zoom)
      const eventNextStep = this.nextZoomStep(event.viewState?.zoom)
      return stateNextStep != eventNextStep
    }

    const statePrevStep = this.prevZoomStep(event.oldViewState?.zoom)
    const eventPrevStep = this.prevZoomStep(event.viewState?.zoom)
    return statePrevStep !== eventPrevStep
  }

  getViews(): any[] {
    return []
  }

  getViewController(): ViewController | undefined {
    return this.props.viewController
  }

  notifyViewZooming(event: any) {
    if (!this.props.onViewZooming) return

    if (event.oldViewState.zoom === event.viewState.zoom) {
      return
    }

    if (this.hasReachedZoomThreshold(event)) {
      if (this.onViewZoomingDebounced.cancel) this.onViewZoomingDebounced.cancel()
      this.props.onViewZooming(event, this.getViewState())
    } else {
      this.onViewZoomingDebounced(event, this.getViewState())
    }
  }

  onViewStateChange(event) {
    if (this.props.visualization?.id !== this.visualizationId || !this.props.world || !this.props.viewState?.viewport) return

    if (event.interactionState.isZooming) {
      this.notifyViewZooming(event)
    }

    this.setState({viewState: this.props.viewState.withDeckViewState(event.viewState)})
  }

  onViewHover(info: PickingInfo) {    
    this.setState({isHoveringLayer: false, rowHovering: undefined})
    return this.props.onViewHover && this.props.onViewHover(info)
  }

  onViewClick(info: PickingInfo) {
    if (this.state.cursor) this.setState({cursor: null})
    return this.props.onViewClick && this.props.onViewClick(info)
  }

  isSelectedLayer(info: PickingInfo) {
    return !!(
      this.props.rowSelection?.layerId &&
      this.props.rowSelection.layerId === (info.layer?.props as any)?.layerId
    )
  }

  onViewDragStart(info: PickingInfo) {
    if (this.isSelectedLayer(info)) return
    if (this.state.cursor) this.setState({cursor: null})
    return this.props.onViewDragStart && this.props.onViewDragStart(info)
  }

  onViewDragEnd(info) {
    if (this.isSelectedLayer(info)) return
    this.props.onViewDragEnd(info, this.getViewState()?.getDeckViewState(this.props.world))
  }

  getMainViewport() {
    const viewports = this.deckgl.current?.deck?.getViewports() ?? []
    const viewport = viewports.find((v) => v.id === 'main-view') ?? viewports[0]
    return viewport ? new viewport.ViewportType({...viewport}) : undefined
  }

  onViewLoad() {
    const mainViewport = this.getMainViewport()
    // Weird iframe bug that happens when changing tabs while loading deck
    if (!mainViewport) return

    const boundingClientRect = this.deckgl.current.deck.canvas.getBoundingClientRect()
    const dimensions = {
      width: boundingClientRect.width,
      height: boundingClientRect.height,
    } 

    this.props.onViewLoad(this.getUpdatedViewport(mainViewport, dimensions), dimensions)
  }

  getUpdatedViewport(viewport: OrbitViewport | OrthographicViewport | WebMercatorViewport, dimensions: Dimensions): OrbitViewport | OrthographicViewport | WebMercatorViewport {
    return new viewport.ViewportType({
      ...viewport,
      ...dimensions,
    } as any) as OrbitViewport | OrthographicViewport | WebMercatorViewport
  }

  onViewResize(dimensions: Dimensions) {
    const mainViewport = this.getMainViewport()
    if (!this.props.viewState || !mainViewport) return
    if (!this.props.viewState.viewport) return this.props.onViewLoad(this.getUpdatedViewport(mainViewport, dimensions), dimensions)
    this.props.onViewResize(this.getUpdatedViewport(mainViewport, dimensions), dimensions)
  }

  getEffects(): any[] {
    return []
  }

  getPickingRadius() {
    return 0
  }

  shouldBypassLayerEventOverride(layer?: any) {
    return layer && !layer.props.pickable ||
      layer instanceof MultiBitmapLayer ||
      layer instanceof EditableGeoJsonLayer ||
      layer instanceof LineLayer ||
      layer instanceof PolygonLayer ||
      layer instanceof ScenegraphLayer && !layer.props.editable
  }

  _onEvent(event) {
    const deck = this.deckgl.current?.deck
    const pos = event.offsetCenter
    if (!this.props.isOnObjectEditor || !deck || !pos) return

    const layers = deck.layerManager.getLayers()
    const info = deck.deckPicker!.getLastPickedObject(
      {x: pos.x, y: pos.y, layers, viewports: deck.getViewports(pos)},
      deck._lastPointerDownInfo)

    if (this.shouldBypassLayerEventOverride(info.layer)) return
    if (info.layer && (event.leftButton || event.rightButton)) event.stopImmediatePropagation()

    deck._onEvent(event)
  }

  addEventHandlers() {
    const eventManager = this.deckgl.current?.deck?.eventManager
    if (!eventManager || this.isEvenHandlerRegistered) return

    for (const eventType of DECK_EVENT_TYPES) {
      eventManager.on(eventType, this._onEvent.bind(this), {priority: 101})
    }

    this.isEvenHandlerRegistered = true
  }

  removeEventHandlers() {
    const eventManager = this.deckgl.current?.deck?.eventManager
    if (!eventManager || !this.isEvenHandlerRegistered) return
    for (const eventType of DECK_EVENT_TYPES) {
      eventManager.off(eventType, this._onEvent.bind(this))
    }
  }

  componentDidMount(): void {
    this.addEventHandlers()
  }

  componentDidUpdate() {
    this.addEventHandlers()
  }

  componentWillUnmount(): void {
    this.removeEventHandlers()
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    // Was just a view state update?
    this.usePreviousViewLayers =
      (nextState.viewState !== this.state.viewState || nextState.isHoveringLayer !== this.state.isHoveringLayer) &&
      nextProps === this.props &&
      this.state.rowEdit === nextState.draggingRow &&
      this.state.fetchResourceLastModified === nextState.fetchResourceLastModified &&
      this.state.rowHovering === nextState.rowHovering
  }

  getMapViewLayer() {
    if (this.renderMap && this.props.viewState) {
      return createMapViewLayer(this.props.layers, this.props.viewState.zoom, this.props.mapStyle)
    }
  }

  onError(e) {
    if (e.message === 'WebGL context is lost') {
      window.location.reload()
    }
  }

  render(): React.ReactNode {
    const deckViewState = this.getViewState()?.getDeckViewState()
    if (!this.props.visualization || !deckViewState) return null

    const mapViewLayer = this.getMapViewLayer()

    return (
      <div onContextMenu={(evt) => evt.preventDefault()}>
        <APIProvider apiKey={Config.getValue('GOOGLE_MAPS_API_KEY')}>
          <DeckGL ref={this.deckgl}
                  viewState={deckViewState}
                  views={this.getViews()}
                  layers={this.getViewLayers()}
                  onLoad={this.onViewLoad.bind(this)}
                  onResize={this.onViewResizeDebounced}
                  onHover={this.onViewHover.bind(this)}
                  layerFilter={this.viewLayerFilter}
                  onClick={this.onViewClick.bind(this)}
                  onDragStart={this.onViewDragStart.bind(this)}
                  onDragEnd={this.onViewDragEnd.bind(this)}
                  onViewStateChange={(event: any) => this.onViewStateChange(event)}
                  getCursor={this.getCursor.bind(this)}
                  effects={this.getEffects()}
                  pickingRadius={this.getPickingRadius()}
                  onError={this.onError.bind(this)}>
            {
              mapViewLayer && mapViewLayer.source === MapStyleSource.google ?
                <GoogleMap
                  defaultZoom={deckViewState.zoom}
                  defaultCenter={{lat: deckViewState.latitude, lng: deckViewState.longitude}}
                  mapTypeId={mapViewLayer.style}
                  tilt={0}
                  reuseMaps={true}
                  renderingType='VECTOR'/>
                :
                <MapGL
                  ref={this.mapRef}
                  minZoom={deckViewState.minZoom}
                  maxZoom={deckViewState.maxZoom}
                  reuseMaps
                  mapStyle={mapViewLayer?.style}
                  interactive={false}
                  attributionControl={false}/>
            }
          </DeckGL>
        </APIProvider>
      </div>
    )
  }
}

export default DeckView
