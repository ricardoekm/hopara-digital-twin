import {Query, SCOPE_COLUMN_NAME} from '@hopara/dataset'
import {Layer} from '../layer/Layer'
import {PaginatedRowset} from '../paginated-rowset/PaginatedRowset'
import { getNewRowName } from './RowName'
import { DetailsField } from '../details/DetailsField'

export function getRowTitleField(query: Query | undefined, layer: Layer | undefined): DetailsField | undefined {
  if (!query || !layer) return undefined

  const editableColumn = query.columns.find((column) => column.isEditable)
  if (editableColumn) {
    const detailField = layer.details.fields.find((f) => f.value.encoding.text?.field === editableColumn.getName())
    return detailField ?? DetailsField.fromColumn(editableColumn)
  }

  const firstTextDetail = layer.details.fields.find((f) => f.value.encoding.text)
  return firstTextDetail
}

export function createRow(layer: Layer, query: Query, rowset: PaginatedRowset) {
  const titleField = getRowTitleField(query, layer)
  if (!titleField) return

  return {
    [titleField.getField()]: getNewRowName(layer.name, rowset),
    [SCOPE_COLUMN_NAME]: layer.encoding.position?.scope,
  }
}
