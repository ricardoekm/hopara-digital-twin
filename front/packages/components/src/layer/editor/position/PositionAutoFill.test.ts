import { Column, Columns, ColumnType, Query } from '@hopara/dataset'
import { autoFillPosition, getSuggestion, hasChangedLayerType } from './PositionAutoFill'
import { Data, PositionEncoding } from '@hopara/encoding'
import { LayerType } from '../../LayerType'
import { Layer } from '../../Layer'
import { VisualizationType } from '../../../visualization/Visualization'
import { PositionType } from '@hopara/encoding/src/position/PositionEncoding'
import { getAnyLayer } from '../../Layer.test'

test('prioritize geometry column', () => {
  const columns = new Columns()
  columns.push(new Column({name: 'lat', type: ColumnType.DECIMAL}))
  columns.push(new Column({name: 'long', type: ColumnType.DECIMAL}))
  columns.push(new Column({name: 'geometria', type: ColumnType.GEOMETRY}))

  const suggestion = getSuggestion(['lat'], columns)
  expect(suggestion?.getName()).toEqual('geometria')
})

test('takes decimal column', () => {
  const columns = new Columns()
  columns.push(new Column({name: 'blabla', type: ColumnType.DECIMAL, quantitative: true}))
  columns.push(new Column({name: 'lat', type: ColumnType.DECIMAL, quantitative: true}))
  columns.push(new Column({name: 'long', type: ColumnType.DECIMAL, quantitative: true}))

  const suggestion = getSuggestion(['lat'], columns)
  expect(suggestion?.getName()).toEqual('lat')
})

test('takes decimal column is case insensitive', () => {
  const columns = new Columns()
  columns.push(new Column({name: 'Lat', type: ColumnType.DECIMAL, quantitative: true}))

  const suggestion = getSuggestion(['lat'], columns)
  expect(suggestion?.getName()).toEqual('Lat')
})

test('only takes word column if is quantitative', () => {
  const columns = new Columns()
  columns.push(new Column({name: 'blabla', type: ColumnType.DECIMAL}))
  columns.push(new Column({name: 'lat', type: ColumnType.STRING}))
  columns.push(new Column({name: 'long', type: ColumnType.DECIMAL}))

  const suggestion = getSuggestion(['lat'], columns)
  expect(suggestion).toBeUndefined()
})

test('Fill with equivalent fields from old position encoding and new query', () => {
  const layer = new Layer({id: 'my-layer', type: LayerType.line})

  const columns = new Columns()
  columns.push(new Column({name: 'timestamp'}))
  columns.push(new Column({name: 'value'}))
  const query = new Query({name: 'my-query', dataSource: 'my-ds', columns})

  const positionEncoding = new PositionEncoding({x: { field: 'timestamp' }, y: { field: 'value' }})
  const filledPositionEncoding = autoFillPosition(positionEncoding, layer, VisualizationType.GEO, query, query)
  expect(filledPositionEncoding?.x?.field).toEqual('timestamp')
  expect(filledPositionEncoding?.y?.field).toEqual('value')
})

test('Fill with equivalent fields from old position encoding and new query coordinates', () => {
  const layer = new Layer({id: 'my-layer', type: LayerType.line})

  const columns = new Columns()
  columns.push(new Column({name: 'line'}))
  const query = new Query({name: 'my-query', dataSource: 'my-ds', columns})

  const positionEncoding = new PositionEncoding({coordinates: { field: 'line' }})
  const filledPositionEncoding = autoFillPosition(positionEncoding, layer, VisualizationType.GEO, query, query)
  expect(filledPositionEncoding?.coordinates?.field).toEqual('line')
})

test('Has changed layer type', () => {
  const positionEncoding = new PositionEncoding({
    x: { field: 'point_2d' }, 
    y: { field: 'point_2d' },
  })

  expect(hasChangedLayerType(positionEncoding, getAnyLayer({type: LayerType.line}), VisualizationType.GEO)).toBeTruthy()
  expect(hasChangedLayerType(positionEncoding, getAnyLayer({type: LayerType.circle}), VisualizationType.GEO)).toBeFalsy()
})

test('Has changed layer type 2', () => {
  const positionEncoding = new PositionEncoding({
    x: { field: 'point_2d' }, 
    y: { field: 'point_2d' },
    coordinates: { field: 'polygon' },
  })

  expect(hasChangedLayerType(positionEncoding, getAnyLayer({type: LayerType.polygon}), VisualizationType.GEO)).toBeTruthy()
})


test('If is hopara managed should update on change layer type', () => {
  const layer = new Layer({id: 'my-layer', type: LayerType.line})

  const columns = new Columns()
  columns.push(new Column({name: 'point_2d', type: ColumnType.GEOMETRY}))
  columns.push(new Column({name: 'line', type: ColumnType.GEOMETRY}))
  const query = new Query({name: 'my-query', dataSource: 'hopara', columns})

  const positionEncoding = new PositionEncoding({
    x: { field: 'point_2d' }, 
    y: { field: 'point_2d' },
    type: PositionType.MANAGED,
    data: new Data({
      source: 'hopara',
      query: 'my-query_hopara_pos',
    }),
  })
  const filledPositionEncoding = autoFillPosition(positionEncoding, layer, VisualizationType.GEO, query, query)
  expect(filledPositionEncoding?.coordinates?.field).toEqual('line')
})

test('If is custom shouldnt update on change layer type', () => {
  const layer = new Layer({id: 'my-layer', type: LayerType.line})

  const columns = new Columns()
  columns.push(new Column({name: 'point_2d', type: ColumnType.GEOMETRY}))
  columns.push(new Column({name: 'line', type: ColumnType.GEOMETRY}))
  const query = new Query({name: 'my-query', dataSource: 'hopara', columns})

  const positionEncoding = new PositionEncoding({
    x: { field: 'point_2d' }, 
    y: { field: 'point_2d' },
    data: new Data({
      source: 'hopara',
      query: 'my-position-query',
    }),
  })
  const filledPositionEncoding = autoFillPosition(positionEncoding, layer, VisualizationType.GEO, query, query)
  expect(filledPositionEncoding?.x?.field).toEqual('point_2d')
  expect(filledPositionEncoding?.y?.field).toEqual('point_2d')
})

test('Fill with lat/long', () => {
  const layer = new Layer({id: 'my-layer', type: LayerType.circle})

  const columns = new Columns()
  columns.push(new Column({name: 'lat', quantitative: true}))
  columns.push(new Column({name: 'long', quantitative: true}))
  columns.push(new Column({name: 'floor', quantitative: true}))
  
  const query = new Query({name: 'my-query', dataSource: 'my-ds', columns})

  const positionEncoding = autoFillPosition(new PositionEncoding(), layer, VisualizationType.GEO, query, query)
  expect(positionEncoding?.x?.field).toEqual('long')
  expect(positionEncoding?.y?.field).toEqual('lat')
  expect(positionEncoding?.floor?.field).toEqual('floor')
})

test('Fill with geometry', () => {
  const layer = new Layer({id: 'my-layer', type: LayerType.image})

  const columns = new Columns()
  columns.push(new Column({name: 'location', quantitative: true, type: ColumnType.GEOMETRY}))
  const query = new Query({name: 'my-query', dataSource: 'my-ds', columns})

  const positionEncoding = autoFillPosition(new PositionEncoding(), layer, VisualizationType.GEO, query, query)
  expect(positionEncoding?.coordinates?.field).toEqual('location')
  expect(positionEncoding?.x?.field).toBeUndefined()
  expect(positionEncoding?.y?.field).toBeUndefined()
})

test('Fill with fixed if its model', () => {
  const layer = new Layer({id: 'my-layer', type: LayerType.model})

  const columns = new Columns()
  const query = new Query({name: 'my-query', dataSource: 'my-ds', columns})

  const positionEncoding = autoFillPosition(new PositionEncoding(), layer, VisualizationType.THREE_D, query, query)
  expect(positionEncoding?.x?.value).toBe(0)
  expect(positionEncoding?.y?.value).toBe(0)
  expect(positionEncoding?.z?.value).toBe(0)
})

test('Ignore auto fill if filled with fixed positions', () => {
  const layer = new Layer({id: 'my-layer', type: LayerType.model})

  const columns = new Columns()
  columns.push(new Column({name: 'location', quantitative: true, type: ColumnType.GEOMETRY}))
  const query = new Query({name: 'my-query', dataSource: 'my-ds', columns})

  const currentPositionEncoding = new PositionEncoding({x: { value: 0 }, y: { value: 0 }, z: { value: 0 }})
  const positionEncoding = autoFillPosition(currentPositionEncoding, layer, VisualizationType.GEO, query, query)
  expect(positionEncoding?.x?.field).toBeUndefined()
  expect(positionEncoding?.y?.field).toBeUndefined()
  expect(positionEncoding?.z?.field).toBeUndefined()
  expect(positionEncoding?.x?.value).toEqual(0)
  expect(positionEncoding?.y?.value).toEqual(0)
  expect(positionEncoding?.z?.value).toEqual(0)
})

test('Fill with hopara managed', () => {
  const layer = new Layer({id: 'my-layer', type: LayerType.line})

  const columns = new Columns()
  columns.push(new Column({name: 'id', quantitative: true, primaryKey: true}))

  const query = new Query({name: 'my-query', dataSource: 'my-ds', columns})
  const positionEncoding = autoFillPosition(new PositionEncoding(), layer, VisualizationType.GEO, query, query)
  expect(positionEncoding.coordinates?.field).toBe('line')
  expect(positionEncoding.floor?.field).toBe('floor')
})

test('Fill with hopara managed 3d', () => {
  const layer = new Layer({id: 'my-layer', type: LayerType.circle})

  const columns = new Columns()
  columns.push(new Column({name: 'id', quantitative: true, primaryKey: true}))

  const query = new Query({name: 'my-query', dataSource: 'my-ds', columns})
  const positionEncoding = autoFillPosition(new PositionEncoding(), layer, VisualizationType.THREE_D, query, query)
  expect(positionEncoding.x?.field).toBe('point_3d')
  expect(positionEncoding.y?.field).toBe('point_3d')
  expect(positionEncoding.z?.field).toBe('point_3d')
  expect(positionEncoding.floor?.field).toBeUndefined()
})
