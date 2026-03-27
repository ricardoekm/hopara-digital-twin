import {Columns, Queries, Query} from '@hopara/dataset'
import {CircleFactory} from './deck/factory/CircleFactory/CircleFactory'
import {IconFactory} from './deck/factory/IconFactory/IconFactory'
import {ImageFactory} from './deck/factory/ImageFactory/ImageFactory'
import {LineFactory} from './deck/factory/LineFactory/LineFactory'
import {PolygonFactory} from './deck/factory/PolygonFactory/PolygonFactory'
import {TextFactory} from './deck/factory/TextFactory/TextFactory'
import {Layers} from '../layer/Layers'
import {Layer} from '../layer/Layer'
import {ViewLayers} from './ViewLayers'
import {DeckLayer} from './deck/DeckLayer'
import {BaseViewLayerProps, Factories, getFactory, getViewLayerId} from './LayerFactory'
import {World} from '../world/World'
import ViewState from '../view-state/ViewState'
import {Authorization} from '@hopara/authorization'
import OrbitViewport from '../view/deck/OrbitViewport'
import {OrthographicViewport} from '../view/deck/OrthographicViewport'
import {EditModeStore, ViewLayerEditingMode} from './ViewLayerStore'
import {InteractionCallbacks} from './deck/interaction/Interaction'
import {Rowsets} from '../rowset/Rowsets'
import {RowProjector} from '@hopara/projector'
import {getSelectedLayer, RowSelection} from './deck/interaction/RowSelection'
import {RowEdit} from './deck/interaction/RowEdit'
import WebMercatorViewport from '../view/deck/WebMercatorViewport'
import {ModelFactory} from './deck/factory/ModelFactory/ModelFactory'
import {Rowset} from '../rowset/Rowset'
import {LayerType} from '../layer/LayerType'
import { uniqWith } from 'lodash/fp'
import { DataRef } from '@hopara/encoding/src/data/DataRef'
import {ResourceHistory, FetchProgressCallback} from '@hopara/resource'
import IconManager from './deck/factory/IconFactory/IconManager'
import { SELECTION_LAYER_ID_SUFFIX } from './SelectionFeedbackDecorator'
import { isPickable } from './Pickable'
import { Grid } from '../grid/Grid'
import { ResourceGenerateState, ResourceUploadState } from '../resource/ResourceStore'
import { isLayerVisible } from '../layer/LayerVisiblity'
import { isEmpty } from 'lodash'

interface ResourceProps {
  authorization: Authorization
  resourceUploadState?: ResourceUploadState[]
  resourceGenerateState?: ResourceGenerateState[]
  maxTextureSize: number
  imageHistory?: ResourceHistory
  modelHistory?: ResourceHistory
  onResourceDownloadProgressChange: FetchProgressCallback
}

interface EditProps {
  rowEdit?: RowEdit
  isDragging: boolean
  editingMode?: ViewLayerEditingMode
  editing: boolean
  pickable: boolean
  isEditingAnotherLayer: boolean
  rowSelection?: RowSelection
  editable: boolean
}

// todo: usar no layer factory
const isLayerSelected = (layer: Layer, layers: Layers, rowSelection?: RowSelection) => {
  if (!rowSelection) return false
  const selectedLayer = getSelectedLayer(rowSelection, layers)
  return layer.getId() === selectedLayer?.getId()
}

function getEditProps(factoryProps: DeckLayerFactoryProps, layer: Layer, positionQuery: Query, rowset: Rowset): EditProps {
  return {
    editable: !(layer.getPositionData() instanceof DataRef) &&
              factoryProps.isOnObjectEditor &&
              layer.canMove(positionQuery?.canUpdate()) &&
              !factoryProps.lockedRowsetIds.includes(layer.getRowsetId()),
    editingMode: factoryProps.editingMode ? factoryProps.editingMode.getEditingMode(layer.type) : undefined,
    pickable: isPickable(layer, factoryProps.isOnObjectEditor, factoryProps.isOnLayerEditor, factoryProps.lockedRowsetIds),
    editing: factoryProps.isOnObjectEditor && !factoryProps.lockedRowsetIds.includes(layer.getRowsetId()),
    isEditingAnotherLayer: !!factoryProps.rowSelection?.layerId && factoryProps.rowSelection?.layerId !== layer.getId(),
    rowSelection: isLayerSelected(layer, factoryProps.layers, factoryProps.rowSelection) && rowset.getId() === factoryProps.rowSelection?.rowsetId ?
                  factoryProps.rowSelection :
                  undefined,
    rowEdit: rowset.getId() === factoryProps.rowEdit?.rowsetId ? factoryProps.rowEdit : undefined,
    isDragging: !!factoryProps.rowEdit && rowset.getId() === factoryProps.rowEdit?.rowsetId,
  }
}

export const factories: Factories<DeckLayerProps> = {
  'circle': new CircleFactory(),
  'icon': new IconFactory(),
  'image': new ImageFactory(),
  'line': new LineFactory(),
  'polygon': new PolygonFactory(),
  'text': new TextFactory(),
  'model': new ModelFactory(),
}

export interface DeckLayerFactoryProps {
  layers: Layers
  rowsets: Rowsets
  queries?: Queries
  zoom: number
  lockedRowsetIds: string[]
  world?: World
  rowProjector?: RowProjector
  viewState?: ViewState
  rowSelection?: RowSelection
  rowEdit?: RowEdit
  rowHovering?: RowEdit
  resource: ResourceProps
  imageHistory?: ResourceHistory
  editingMode?: EditModeStore
  isOnObjectEditor: boolean
  isOnLayerEditor: boolean
  isOnSettingsEditor: boolean
  callbacks: InteractionCallbacks
  editAccentColor: string
  iconManager: IconManager
  grids?: Grid[]
  animationFps?: number
}

export interface DeckLayerProps extends BaseViewLayerProps {
  rowsetId: string
  highlight?: boolean
  resource: ResourceProps
  edit: EditProps
  viewport?: OrthographicViewport | WebMercatorViewport | OrbitViewport
  callbacks: InteractionCallbacks
  iconManager: IconManager
  animationFps?: number
}

function getLayerProps(factoryProps: DeckLayerFactoryProps, layer: Layer, columns: Columns,
                       rowset: Rowset, positionQuery: Query, parentLayer?: Layer): DeckLayerProps {
                      factoryProps.rowEdit?.layerId
    
  return {
    id: getViewLayerId(layer),
    layerId: layer.getId(),
    parentId: layer.parentId,
    layerType: layer.type,
    encoding: layer.encoding.mergeWith(parentLayer?.encoding), // required for templates to work ok
    highlight: layer.highlight,
    viewState: factoryProps.viewState!,
    viewport: factoryProps.viewState?.getViewport(),
    iconManager: factoryProps.iconManager,
    visible: {
      value: isLayerVisible(layer, factoryProps.zoom, factoryProps.isOnObjectEditor ? factoryProps.rowSelection?.layerId : undefined),
      condition: layer.visible?.condition
    },
    animationFps: factoryProps.animationFps,
    rows: rowset.rows,
    rowsetId: rowset.getId(),
    columns: columns as Columns,

    lastModified: layer.getLastModified(),
    canMove: layer.canMove(positionQuery?.canUpdate()),
    edit: getEditProps(factoryProps, layer, positionQuery, rowset),
    resource: factoryProps.resource,

    transform: parentLayer?.getTransform() ? parentLayer.getTransform() : layer.getTransform(),
    callbacks: factoryProps.callbacks,
    editAccentColor: factoryProps.editAccentColor,
    filterPlaced: true,
  }
}

function doCreateFromLayer(factoryProps: DeckLayerFactoryProps, layer: Layer, columns: Columns, rowset: Rowset, positionQuery: Query, parentLayer?: Layer) {
  const layerProps = getLayerProps(factoryProps, layer, columns, rowset, positionQuery, parentLayer)
  const factory = getFactory(factories, layer, factoryProps)
  return factory.create(layerProps)
}

export function createFromLayer(props: DeckLayerFactoryProps, layer: Layer): DeckLayer | DeckLayer[] {
  if (!layer.shouldRender(props.rowsets)) return []

  const rowset = props.rowsets.getById(layer.getRowsetId())
  if (!rowset) return []

  const positionQuery = props.queries?.findQuery(layer.getPositionQueryKey()) as Query
  const columns = props.queries?.getColumns(layer.getQueryKey()) as Columns

  if (layer.isParent()) {
    return layer.getRenderLayers()!.map((child: Layer) => {
      return doCreateFromLayer(props, child, columns, rowset, positionQuery, layer)
    }).flat()
  } else {
    return doCreateFromLayer(props, layer, columns, rowset, positionQuery)
  }
}

const withEditingId = (layer: DeckLayer, another: DeckLayer) => {
  return !!(layer.props?.id?.endsWith('#editable') && another.props?.id?.endsWith('#editable'))
}

export const createViewLayers = (props: DeckLayerFactoryProps): ViewLayers => {
  if (!props.layers || props.layers.length === 0) return new ViewLayers()

  const viewLayers = props.layers
    .filter((layer) => layer.type.toLowerCase() !== LayerType.map)
    .map((layer: Layer) => createFromLayer(props, layer))
    .flat()
    .sort((a, b) => {
      const aIsSelection = a.id?.includes(SELECTION_LAYER_ID_SUFFIX) ?? false
      const bIsSelection = b.id?.includes(SELECTION_LAYER_ID_SUFFIX) ?? false
      return (aIsSelection === bIsSelection) ? 0 : (aIsSelection ? -1 : 1)
    })
    .filter((layer) => !isEmpty(layer))

  return uniqWith(withEditingId, viewLayers)
}
