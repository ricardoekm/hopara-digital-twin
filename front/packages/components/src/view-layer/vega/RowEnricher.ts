
import { Row, Rows } from '@hopara/dataset'
import { pick } from 'lodash/fp'

export const ROW_LAYER_ID = '_lId'
export const ROW_ROWSET_ID = '_rId'
export const ROW_INDEX = '_rIdx'

// On vega callbacks we don't have access to the original layer or rowset
// so we need to add it to the rows
function enrichRow(row:Row, index:number, layerId: string, rowsetId: string) {
  const enrichedRow = new Row({...row})
  enrichedRow[ROW_LAYER_ID] = layerId
  enrichedRow[ROW_ROWSET_ID] = rowsetId
  enrichedRow[ROW_INDEX] = index
  return enrichedRow
}

export function enrichRows(rows:Rows, layerId: string, rowsetId: string) {
  const enrichedRows = rows.map((row, index) => {
    return enrichRow(row, index, layerId, rowsetId)
  })
  return enrichedRows
}

export function getEnrichedData(row:any) {
  return pick([ROW_LAYER_ID, ROW_ROWSET_ID, ROW_INDEX], row)
}
