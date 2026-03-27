import { Row, Rows } from '@hopara/dataset'
import { ROW_INDEX, ROW_LAYER_ID, ROW_ROWSET_ID, enrichRows, getEnrichedData } from './RowEnricher'

test('enrich rows', () => {
  const rows = new Rows()
  rows.push(new Row({type: 'a'}))

  const enrichedRow = enrichRows(rows, 'layerId', 'rowsetId')[0]
  expect(enrichedRow.type).toEqual('a')
  expect(enrichedRow[ROW_LAYER_ID]).toEqual('layerId')
  expect(enrichedRow[ROW_ROWSET_ID]).toEqual('rowsetId')
  expect(enrichedRow[ROW_INDEX]).toEqual(0)
})

test('get enriched data', () => {
  const rows = new Rows()
  rows.push(new Row({type: 'a'}))

  const enrichedRow = enrichRows(rows, 'layerId', 'rowsetId')[0]
  const enrichedData = getEnrichedData(enrichedRow)

  expect(enrichedData).toEqual({
    '_lId': 'layerId',
    '_rId': 'rowsetId',
    '_rIdx': 0,
  })
})
