import { Rows } from '@hopara/dataset'
import { PaginatedRowset } from '../paginated-rowset/PaginatedRowset'
import { getNewRowName } from './RowName'

test('Get row name returns number is all data is present', () => {
  const layerName = 'floorplans'
  const rowset = new PaginatedRowset({offset: 0, limit: 10, lastPage: true, rows: new Rows(5 as any)})

  const name = getNewRowName(layerName, rowset)

  expect(name).toEqual('floorplan 6')
})

test('Get row name returns generic name if has partial data', () => {
  const layerName = 'floorplans'
  const rowset = new PaginatedRowset({offset: 0, limit: 10, lastPage: false, rows: new Rows(10 as any)})

  const name = getNewRowName(layerName, rowset)

  expect(name).toEqual('new floorplan')
})
