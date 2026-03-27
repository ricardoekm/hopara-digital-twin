import { Data, Encodings, PositionEncoding, PositionScaleType } from '@hopara/encoding'
import { Layer } from '../layer/Layer'
import { Layers } from '../layer/Layers'
import { Column, ColumnType, Columns, Queries, Query } from '@hopara/dataset'
import { PositionScaleFactory } from './PositionScaleFactory'
import { LayerType } from '../layer/LayerType'

let layers:Layers
let queries:Queries

beforeEach(() => {
  layers = new Layers()
  queries = new Queries()

  const positionEncoding = new PositionEncoding({
    x: {
      field: 'time-column',
    },
    y: {
      field: 'decimal-column',
    },
  })
  
  const data = new Data({ source: 'my-ds', query: 'my-query' })
  const layer = new Layer()
  layer.encoding = new Encodings({position: positionEncoding})
  layer.data = data

  layers.push(layer)

  const timeColumn = new Column({name: 'time-column', type: ColumnType.DATETIME})
  const decimalColumn = new Column({name: 'decimal-column', type: ColumnType.DECIMAL})
  
  const columns = new Columns()
  columns.push(timeColumn)
  columns.push(decimalColumn)

  const query = new Query({name: data.query, dataSource: data.source, columns})
  queries.push(query)
})

test('from layers', () => {
  const positionScales = PositionScaleFactory.fromLayers(layers, queries)
  expect(positionScales.x).toEqual(PositionScaleType.TIME)
  expect(positionScales.y).toEqual(PositionScaleType.LINEAR)
})

// Under the hoods the line layer uses vega
test('prioritize line layer', () => {
  const lineLayer = new Layer()
  lineLayer.type = LayerType.line

  const linePositionEncoding = new PositionEncoding({
    x: {
      field: 'decimal-column',
    },
    y: {
      field: 'decimal-column',
    },
  })
  lineLayer.encoding = new Encodings({position: linePositionEncoding})
  layers.push(lineLayer)

  const positionScales = PositionScaleFactory.fromLayers(layers, queries)
  expect(positionScales.x).toEqual(PositionScaleType.LINEAR)
  expect(positionScales.y).toEqual(PositionScaleType.LINEAR)
})

test('if query is not found return default', () => {
  const positionScales = PositionScaleFactory.fromLayers(layers, new Queries())
  expect(positionScales.x).toEqual(PositionScaleType.LINEAR)
  expect(positionScales.y).toEqual(PositionScaleType.LINEAR)
})
