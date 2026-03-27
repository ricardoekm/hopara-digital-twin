import { Columns, Rows } from '@hopara/dataset'
import { Condition, Encodings, Transform } from '@hopara/encoding'
import { Layer } from '../layer/Layer'
import ViewState from '../view-state/ViewState'
import { RowProcessorDecorator } from './row/RowProcessorDecorator'
import { RowProcessor } from './row/RowProcessor'
import { LayerType } from '../layer/LayerType'
import { SnapFeedbackDecorator } from './SnapFeebackDecorator'
import { SelectionFeedbackDecorator } from './SelectionFeedbackDecorator'
import { DeckLayerFactoryProps } from './DeckLayerFactory'
import { getSelectedLayer } from './deck/interaction/RowSelection'
import { createFactoryChain } from './LayerFactoryChain'
import { RowVisibilityFilterDecorator } from './row/RowVisibilityFilterDecorator'
import { GridDecorator } from './GridDecorator'

export type Visible = {
  value: boolean,
  condition?: Condition
}

export interface BaseViewLayerProps {
  id: string
  layerId: string // raw layer.getId()
  parentId?: string // raw parent id
  canMove?: boolean
  layerType: LayerType
  viewState: ViewState
  rows: Rows
  columns: Columns
  encoding: Encodings
  visible?: Visible
  transform?: Transform
  lastModified?: Date
  editAccentColor: string
  filterPlaced?: boolean
}

export interface LayerFactory<P> {
  create(props: P): any[]
}

export interface Factories<P> {
  [factoryName: string]: LayerFactory<P>
}

const getRowSelection = (layer: Layer, factoryProps: DeckLayerFactoryProps) => {
  if (!factoryProps.rowSelection) return

  const selectedLayer = getSelectedLayer(factoryProps.rowSelection, factoryProps.layers)
  if (layer.getId() === selectedLayer?.getId()) return factoryProps.rowSelection

  return
}

const getRowHovering = (layer: Layer, factoryProps: DeckLayerFactoryProps) => {
  if (factoryProps.rowEdit) return undefined

  const parentLayer = factoryProps.layers.getById(factoryProps.rowHovering?.layerId)
  const selectedParentLayer = factoryProps.layers.getById(factoryProps.rowSelection?.layerId)
  if (parentLayer?.getId() === selectedParentLayer?.getId()) return undefined

  return factoryProps.rowHovering?.layerId === layer.getId() ? factoryProps.rowHovering : undefined
}

const getRowEdit = (layer: Layer, factoryProps: DeckLayerFactoryProps) => {
  if (factoryProps.rowEdit?.rowsetId !== layer.getRowsetId()) return undefined
  return factoryProps.rowEdit
}

const getSnapRowEdit = (layer: Layer, factoryProps: DeckLayerFactoryProps) => {
  if (factoryProps.rowEdit?.rowsetId !== layer.getRowsetId()) return undefined
  if (factoryProps.rowEdit?.layerId !== layer.getId()) return undefined
  return factoryProps.rowEdit
}

export function getFactory<P extends BaseViewLayerProps>(
  factories: Factories<P>,
  layer: Layer,
  factoryProps: DeckLayerFactoryProps,
): LayerFactory<P> {
  const viewState = factoryProps.viewState!
  const world = factoryProps.world!
  const rowProjector = factoryProps.rowProjector!
  const rowEdit = getRowEdit(layer, factoryProps)
  const snapRowEdit = getSnapRowEdit(layer, factoryProps)
  const rowSelection = getRowSelection(layer, factoryProps)
  const rowHovering = getRowHovering(layer, factoryProps)

  const rowProcessor = new RowProcessor(viewState, world, rowProjector, rowEdit)
  const factory = factories[layer.type.toLowerCase()]
  
  return createFactoryChain<P>([
    new RowProcessorDecorator<P>(rowProcessor), 
    new SnapFeedbackDecorator<P>(snapRowEdit), 
    new SelectionFeedbackDecorator<P>(rowSelection, rowHovering),
    new RowVisibilityFilterDecorator(),
    new GridDecorator<P>(factoryProps, layer),
  ], factory)
}

export function hasFactory<P>(factories: Factories<P>) {
  return (layer: Layer) => !!factories[layer.type.toLowerCase()]
}

export function getViewLayerId(layer: Layer) {
  // We need to add the type so if the type changes deck.gl reset the layer buffer  
  return [
    layer.getId(),
    layer.type,
  ].join('#')
}
