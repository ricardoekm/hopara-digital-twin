import { Row, SCOPE_COLUMN_NAME } from '@hopara/dataset'
import { PositionEncoding } from '@hopara/encoding'
import { PositionNormalizer } from './PositionNormalizer'
import { RowCoordinates } from '@hopara/spatial'

const geometry = [[1, 1], [1, 5], [5, 5], [5, 1], [1, 1]]
const xyRow = new Row({longitude: 10, latitude: 20})
const xyFloorRow = new Row({longitude: 10, latitude: 20, level: 'ground'})
const polygonRow = new Row({geometry})
const positionNormalizer = new PositionNormalizer()

test('normalize position to coordinates', () => {
  const positionEncoding = new PositionEncoding({
    x: {
      field: 'longitude',
    },
    y: {
      field: 'latitude',
    },
  })

  const normalizedRow = positionNormalizer.normalize(xyRow, positionEncoding)
  expect(normalizedRow.getCoordinates()).toEqual(new RowCoordinates({x: 10, y: 20, projected: false}))
})

test('normalize position with floor to coordinates', () => {
  const positionEncoding = new PositionEncoding({
    x: {
      field: 'longitude',
    },
    y: {
      field: 'latitude',
    },
    floor: {
      field: 'level',
    },
  })

  const normalizedRow = positionNormalizer.normalize(xyFloorRow, positionEncoding)
  expect(normalizedRow.getCoordinates()).toEqual(new RowCoordinates({x: 10, y: 20, floor: 'ground', projected: false}))
})

test('normalize fixed position to coordinates', () => {
  const positionEncoding = new PositionEncoding({
    x: {
      value: 40,
    },
    y: {
      value: 50,
    },
  })

  const normalizedRow = positionNormalizer.normalize(xyRow, positionEncoding)
  expect(normalizedRow.getCoordinates()).toEqual(new RowCoordinates({x: 40, y: 50, projected: false}))
})

test('normalize coordinates position', () => {
  const positionEncoding = new PositionEncoding({
    coordinates: {
      field: 'geometry',
    },
  })

  const normalizedRow = positionNormalizer.normalize(polygonRow, positionEncoding)
  expect(normalizedRow.getCoordinates()).toEqual(new RowCoordinates({geometry, projected: false}))
})

test('get position values position', () => {
  const positionEncoding = new PositionEncoding({
    x: {
      field: 'longitude',
    },
    y: {
      field: 'latitude',
    },
    scope: 'nenem',
  })

  const row = xyRow.updateCoordinates(new RowCoordinates({x: 50, y: 10}))
  const positionValues = positionNormalizer.getPositionValues(row, positionEncoding)
  expect(positionValues.longitude).toEqual(50)
  expect(positionValues.latitude).toEqual(10)
  expect(positionValues[SCOPE_COLUMN_NAME]).toEqual('nenem')
})

test('get position values translate to geometry', () => {
  const positionEncoding = new PositionEncoding({
    x: {
      field: 'location',
    },
    y: {
      field: 'location',
    },
  })

  const row = xyRow.updateCoordinates(new RowCoordinates({x: 50, y: 10}))
  const positionValues = positionNormalizer.getPositionValues(row, positionEncoding)
  expect(positionValues.location).toEqual([[50, 10]])
})

test('denormalize also unplaces', () => {
  const positionEncoding = new PositionEncoding({
    x: {
      field: 'longitude',
    },
    y: {
      field: 'latitude',
    },
  })

  const coordinates = new RowCoordinates({x: undefined, y: undefined})
  const updatedRow = xyRow.updateCoordinates(coordinates)
  const denormalizedRow = positionNormalizer.getPositionValues(updatedRow, positionEncoding)
  expect(denormalizedRow.longitude).toEqual(null)
  expect(denormalizedRow.latitude).toEqual(null)
})

test('denormalize fill fields from coordinates', () => {
  const positionEncoding = new PositionEncoding({
    x: {
      field: 'longitude',
    },
    y: {
      field: 'latitude',
    },
  })

  const updatedRow = xyRow.updateCoordinates(new RowCoordinates({x: 40, y: 50}))
  const denormalizedRow = positionNormalizer.getPositionValues(updatedRow, positionEncoding)
  expect(denormalizedRow.longitude).toEqual(40)
  expect(denormalizedRow.latitude).toEqual(50)
})

test('denormalize with geometry column', () => {
  const positionEncoding = new PositionEncoding({
    coordinates: {
      field: 'geometry',
    },
  })

  const geometry = [[1, 1], [1, 2], [1, 1]]
  const updatedRow = polygonRow.updateCoordinates(new RowCoordinates({geometry}))
  const denormalizedRow = positionNormalizer.getPositionValues(updatedRow, positionEncoding)
  expect(denormalizedRow.geometry).toEqual(geometry)
})

test('denormalize with point', () => {
  const positionEncoding = new PositionEncoding({
    x: {
      field: 'location',
    },
    y: {
      field: 'location',
    },
  })

  const updatedRow = xyRow.updateCoordinates(new RowCoordinates({x: 40, y: 50}))
  const denormalizedRow = positionNormalizer.getPositionValues(updatedRow, positionEncoding)
  expect(denormalizedRow.location).toEqual([[40, 50]])
})
