import { Columns } from '../column/Columns'
import { createIndexedRowsById } from './IndexedRows'
import { Row } from './Row'
import { Rows } from './Rows'

test('ID as integers', () => {
  const rows = new Rows(new Row({ _id: 1, name: 'foo' }),
                        new Row({ _id: 2, name: 'bar' }))
  rows.columns = new Columns()
  const indexedRows = createIndexedRowsById(rows)
  expect(indexedRows.get(1 as any)!.name).toEqual('foo')
})
