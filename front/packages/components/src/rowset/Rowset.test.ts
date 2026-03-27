import {clone} from '@hopara/object/src/clone'
import {Row, Rows} from '@hopara/dataset'
import {Rowset} from './Rowset'
import { getAnyData } from '../query/Data.test'
import { Data, PositionEncoding } from '@hopara/encoding'

export function getAnyRowset(props = {}) : Rowset {
  return clone<Rowset>(new Rowset({
    data: getAnyData(),
    positionEncoding: new PositionEncoding({
      x: {
        field: 'longitude',
      },
      y: {
        field: 'latitude',
      },
    }),
  }), props)
}

test('Update row', () => {
  const rowset = new Rowset({data: new Data({query: 'dataset', source: 'ds'})})
  const galo = {'_id': '123', 'cidade': 'Volta Redonda'}
  rowset.rows = new Rows(galo)

  const changedGalo = new Row({'_id': '123', 'cidade': 'Rio de Janeiro'})
  const updatedRowset = rowset.updateRow(changedGalo)

  expect(updatedRowset.rows.length).toEqual(1)
  expect(updatedRowset.rows[0]).toEqual(changedGalo)
})

// For the scenario of rooms and room labels
test('Coordinates and x, y are equivalent', () => {
  const positionEncodingXY = new PositionEncoding({x: { field: 'coordinates'}, y: { field: 'coordinates'}})
  const rowsetXY = new Rowset({positionEncoding: positionEncodingXY})

  const positionEncodingCoordinates = new PositionEncoding({coordinates: { field: 'coordinates'}})
  const rowsetCoordinates = new Rowset({positionEncoding: positionEncodingCoordinates})

  expect(rowsetXY.getId()).toEqual(rowsetCoordinates.getId())
})

test('Delete row', () => {
  const rowset = new Rowset({data: new Data({query: 'dataset', source: 'ds'})})
  const galo = new Row({'_id': '123', 'cidade': 'Volta Redonda'})
  const brad = new Row({'_id': '123', 'cidade': 'Niteroi'})
  rowset.rows = new Rows(galo, brad)
  expect(rowset.rows.length).toEqual(2)

  const updatedRowset = rowset.deleteRow(galo)

  expect(updatedRowset.rows.length).toEqual(1)
})
