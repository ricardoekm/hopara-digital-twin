import {Data, Encodings, ImageEncoding, PositionEncoding} from '@hopara/encoding'
import {Layer, PlainLayer} from '../layer/Layer'
import {Layers} from '../layer/Layers'
import {EntityFactory} from './EntityFactory'
import {Column, Columns, Queries, Query, QueryWriteLevel} from '@hopara/dataset'
import {ClusterTransform} from '../transform/ClusterTransform'
import {LayerType} from '../layer/LayerType'
import {DataRef} from '@hopara/encoding/src/data/DataRef'
import {getAnyLayer} from '../layer/Layer.test'

let data: Data
let notWritableData: Data
let layer: Layer
let query: Query
let notWritableQuery: Query

beforeEach(() => {
  data = data = new Data({source: 'hopara', query: 'sensors'})
  layer = getAnyLayer({data})
  query = new Query({name: data.query, dataSource: data.source})
  query.writeLevel = QueryWriteLevel.UPDATE
  query.columns = new Columns(new Column({name: 'id', primaryKey: true}))

  notWritableData = new Data({source: 'hopara', query: 'sensorsbug'})
  notWritableQuery = new Query({name: notWritableData.query, dataSource: notWritableData.source})
})

test('If the position query is writable the layer should be candidate', () => {
  const writableQueryLayer = getAnyLayer({notWritableData})
  writableQueryLayer.encoding.position!.data = data

  const entities = EntityFactory.create(new Layers(writableQueryLayer), new Queries(query, notWritableQuery))
  expect(entities.length).toEqual(1)
})

// The last layer is the one rendered on top
test('Gets the last layer for each data', () => {
  const otherData = new Data({source: 'hopara', query: 'sensors'})
  const otherLayer = getAnyLayer({data: otherData})

  const entities = EntityFactory.create(new Layers(layer, otherLayer), new Queries(query))
  expect(entities.length).toEqual(1)
  expect(entities[0].layer.getId()).toEqual(otherLayer.getId())
})

test('Ignore data ref layers', () => {
  layer.encoding.position = new PositionEncoding({data: new DataRef()})

  const entities = EntityFactory.create(new Layers(layer), new Queries(query))
  expect(entities.length).toEqual(0)
})

test('If theres no layer returns empty', () => {
  const entities = EntityFactory.create(new Layers(), new Queries(query))
  expect(entities.length).toEqual(0)
})

test('Only rowset with writable queries are candidates', () => {
  query.writeLevel = QueryWriteLevel.NONE

  const entities = EntityFactory.create(new Layers(layer), new Queries(query))
  expect(entities.length).toEqual(0)
})

test('Image and model layers are always candidates', () => {
  const positionEncoding = new PositionEncoding({coordinates: {field: 'location'}})
  const imageEncoding = new ImageEncoding({field: 'name'})
  const encodings = new Encodings({position: positionEncoding, image: imageEncoding})
  query.writeLevel = QueryWriteLevel.NONE
  const modelLayer = new Layer({data, type: LayerType.image, encoding: encodings} as PlainLayer)

  const entities = EntityFactory.create(new Layers(modelLayer), new Queries(query))
  expect(entities.length).toEqual(1)
})

test('Layers with transform arent candidates', () => {
  layer.data.transform = new ClusterTransform()

  const entities = EntityFactory.create(new Layers(layer), new Queries(query))
  expect(entities.length).toEqual(0)
})

test('Maps arent candidates', () => {
  layer.type = LayerType.map

  const entities = EntityFactory.create(new Layers(layer), new Queries(query))
  expect(entities.length).toEqual(0)
})


