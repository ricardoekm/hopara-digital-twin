import { Row } from './Row'
import {Rows} from './Rows'

test('get value is case insensitive', () => {
  const rows = new Rows({BIRTHdate: '16/07/1986'})
  expect(rows.getValues('birthDate')).toEqual(['16/07/1986'])
})

test('find by id', () => {
  const row = {_id: 123}
  const rows = new Rows(row)
  expect(rows.getById(123)).toEqual(row)
})

// The position id is always string, this is required for the merge to work ok.
test('find by id works with string', () => {
  const row = {_id: 123}
  const rows = new Rows(row)
  expect(rows.getById('123')).toEqual(row)
})

test('row stack limit', () => {
  const rs = Array.from({length: 1000000}, (_, i) => {
    return new Row({_id: i + 1})
  })

  const rows = new Rows()
  rs.forEach((row) => rows.push(row))

  const rowsWithId = rows.filter((row) => !!row._id)
  expect(rowsWithId.length).toEqual(1000000)

  expect(rowsWithId.getValues('_id').length).toEqual(1000000)
})

test('Order by z_index', () => {
  const rows = new Rows(
    {name: 'A', hopara_z_index: 2},
    {name: 'B', hopara_z_index: 3},
    {name: 'C', hopara_z_index: 1}
  )

  const sortedRows = rows.sortByColumn('hopara_z_index')
  expect(sortedRows[0].name).toEqual('C')
  expect(sortedRows[1].name).toEqual('A')
  expect(sortedRows[2].name).toEqual('B')
}
)
