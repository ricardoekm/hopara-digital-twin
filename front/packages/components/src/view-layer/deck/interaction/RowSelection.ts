import { Rows } from '@hopara/dataset'
import { InteractionSource } from './Interaction'
import { isNil } from 'lodash/fp'
import { Layers } from '../../../layer/Layers'
import { Layer } from '../../../layer/Layer'

export type RowSelection = {
  rowId?: any
  allowRotation?: boolean
  allowImageEdit?: boolean
} & InteractionSource

export function getSelectedRowIndex(rows: Rows, rowSelection?:RowSelection) {
  return rows.findIndex(
    (r) => !isNil(rowSelection?.rowId) && r._id === rowSelection?.rowId,
  )
}

export function getSelectedRow(rows: Rows, rowSelection?:RowSelection) {
  return rows.find(
    (r) => !isNil(rowSelection?.rowId) && r._id === rowSelection?.rowId,
  )
}

export function getSelectedLayer(rowSelection:RowSelection, layers: Layers): Layer | undefined {
  if (!rowSelection) return undefined

  const layer = layers.getById(rowSelection.layerId)
  if (!layer?.hasRenderChildren()) return layer

  return layer.getRenderLayers()[0]
}

