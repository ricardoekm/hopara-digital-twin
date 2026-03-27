import { Row, Rows } from '@hopara/dataset'
import { PositionEncoding } from '@hopara/encoding'
import { RowProjector } from './RowProjector'
import { RowCoordinates } from '@hopara/spatial'
import { IdentityProjector } from './IdentityProjector'
import { PositionNormalizer } from './PositionNormalizer'

const fixedPositionEncoding = new PositionEncoding({
  x: {
    value: 0,
  },
  y: {
    value: 1,
  },
  z: {
    value: 2,
  },
})                             

const timePositionEncoding = new PositionEncoding({
  x: {
    field: 'date',
  },
  y: {
    field: 'temperature',
  },
})

const linearPositionEncoding = new PositionEncoding({
  x: {
    field: 'geometry',
  },
  y: {
    field: 'geometry',
  },
})

const positionNormalizer = new PositionNormalizer()

test('should project rows', () => {
  const rows = new Rows(
    new Row({id: 'row 1', level: 0, temperature: 10, date: 1656790546}),
    new Row({id: 'row 2', level: 0, temperature: 20, date: 1656704146}),
  )

  const rowProjector = new RowProjector(new IdentityProjector())
  const projectedRows = rowProjector.projectRows(positionNormalizer.normalizeRows(rows, timePositionEncoding))

  expect(projectedRows[0].getCoordinates()).toEqual(new RowCoordinates({x: 1656790546, y: 10, z: 0}))
  expect(projectedRows[1].getCoordinates()).toEqual(new RowCoordinates({x: 1656704146, y: 20, z: 0}))
})

test('row projection with fixed values', () => {
  const rows = new Rows(
    new Row({id: 'row 1', level: 0, temperature: 10, date: 1656790546}),
    new Row({id: 'row 2', level: 0, temperature: 20, date: 1656704146}),
  )

  const rowProjector = new RowProjector(new IdentityProjector())
  const projectedRows = rowProjector.projectRows(positionNormalizer.normalizeRows(rows, fixedPositionEncoding))

  expect(projectedRows[0].getCoordinates()).toEqual(new RowCoordinates({x: 0, y: 1, z: 2}))
  expect(projectedRows[1].getCoordinates()).toEqual(new RowCoordinates({x: 0, y: 1, z: 2}))
})

test('should project polygon rows', () => {
  const rows = new Rows(
    new Row({id: 'row 1', geometry: [[1, 1], [1, 5], [5, 5], [5, 1], [1, 1]]}),
    new Row({id: 'row 2', geometry: [[1, 1], [1, 10], [10, 10], [10, 1], [1, 1]]}),
  )

  const rowProjector = new RowProjector(new IdentityProjector())
  const projectedRows = rowProjector.projectRows(positionNormalizer.normalizeRows(rows, linearPositionEncoding))

  const expectedGeometry0 = [[1, 1], [1, 5], [5, 5], [5, 1], [1, 1]]
  expect(projectedRows[0].getCoordinates()).toEqual(new RowCoordinates({x: expectedGeometry0, y: expectedGeometry0}))
  
  const expectedGeometry1 = [[1, 1], [1, 10], [10, 10], [10, 1], [1, 1]]
  expect(projectedRows[1].getCoordinates()).toEqual(new RowCoordinates({x: expectedGeometry1, y: expectedGeometry1}))
})


