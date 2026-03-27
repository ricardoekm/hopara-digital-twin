import { getAnyData } from '../../query/Data.test'
import { Layer, PlainLayer } from '../Layer'
import { LayerFactory } from '../factory/LayerFactory'
import { LayerMutator } from './LayerMutator'
import { LayerType } from '../LayerType'
import { Layers } from '../Layers'
import { Column, Columns, Queries, Query } from '@hopara/dataset'
import { ColorEncoding, ColorScaleType } from '@hopara/encoding'
import { VisualizationType } from '../../visualization/Visualization'

test('mutate layer type', () => {
  const layerFactory = new LayerFactory({})
  const layerMutator = new LayerMutator(layerFactory, VisualizationType.GEO)
  const layer = new Layer({id: 'any-layer1', type: LayerType.circle, data: getAnyData()})
  layer.raw = {...layer} as PlainLayer

  const updatedLayer = layerMutator.mutate(layer, {type: LayerType.text})
  expect(updatedLayer).toMatchObject({ id: 'any-layer1', type: LayerType.text})
})


test('delete child', () => {
  const layerFactory = new LayerFactory({})
  const layerMutator = new LayerMutator(layerFactory, VisualizationType.GEO)

  const childLayer = layerFactory.createLayer({type: LayerType.circle, id: '123', parentId: 'parentId'})
  const children = new Layers(childLayer)

  const parent = layerFactory.createLayer({type: LayerType.composite, id: 'parentId', children} as PlainLayer)
  const mutatedParent = layerMutator.deleteChild(parent, childLayer.getId())
  
  expect(mutatedParent.children?.length).toEqual(0)
})

test('Update composite children', () => {
  const layerFactory = new LayerFactory({})
  const layerMutator = new LayerMutator(layerFactory, VisualizationType.GEO)

  const childLayer = layerFactory.createLayer({type: LayerType.circle, id: 'circleId', parentId: 'compositeId'})
  const children = new Layers(childLayer)

  const parent = layerFactory.createLayer({type: LayerType.composite, id: 'compositeId', children} as PlainLayer)

  const updatedChildLayer = layerFactory.createLayer({type: LayerType.icon, id: 'circleId', parentId: 'compositeId', encoding: {} as any})
  const mutatedParent = layerMutator.updateChild(parent, updatedChildLayer) as any
  
  expect(mutatedParent.children.length).toEqual(1)
  expect(mutatedParent.children[0].type).toEqual(LayerType.icon)
})

test('Update template children', () => {
  const layerFactory = new LayerFactory({})
  const layerMutator = new LayerMutator(layerFactory, VisualizationType.GEO)

  const grandChildLayer = layerFactory.createLayer({type: LayerType.circle, id: 'circleId', parentId: 'templateId-compositeId'})
  const grandChildren = new Layers(grandChildLayer)

  const childLayer = layerFactory.createLayer({type: LayerType.composite, id: 'compositeId', parentId: 'templateId', children: grandChildren})
  const children = new Layers(childLayer)

  const parent = layerFactory.createLayer({type: LayerType.composite, id: 'templateId', children} as PlainLayer)

  const updatedGrandChildLayer = layerFactory.createLayer({type: LayerType.icon, id: 'circleId', parentId: 'templateId-compositeId', encoding: {} as any})
  const mutatedParent = layerMutator.updateChild(parent, updatedGrandChildLayer) as any
  
  expect(mutatedParent.children.length).toEqual(1)
  expect(mutatedParent.children[0].children.length).toEqual(1)
  expect(mutatedParent.children[0].children[0].type).toEqual(LayerType.icon)
})

test('duplicate resets id', () => {
  const layerFactory = new LayerFactory({})
  const layerMutator = new LayerMutator(layerFactory, VisualizationType.GEO)

  const childLayer = layerFactory.createLayer({type: LayerType.circle} as PlainLayer)
  const children = new Layers(childLayer)

  const layer = layerFactory.createLayer({type: LayerType.composite, children} as PlainLayer) as any
  const duplicatedLayer = layerMutator.duplicate(layer) as any

  expect(duplicatedLayer.id).not.toEqual(layer.getId())
  expect(duplicatedLayer.raw.id).not.toEqual(layer.getId())
  expect(duplicatedLayer.children[0].parentId).not.toEqual(layer.children[0].parentId)
  expect(duplicatedLayer.children[0].parentId).toEqual(duplicatedLayer.id)
  expect(duplicatedLayer.children[0].id).not.toEqual(layer.children[0].id)
  expect(duplicatedLayer.children[0].raw.id).not.toEqual(layer.children[0].raw.id)
  expect(duplicatedLayer.raw.children[0].id).not.toEqual(layer.raw.children[0].id)
})

test('keep coordinates if coordinates based', () => {
  const layerFactory = new LayerFactory({})
  const layerMutator = new LayerMutator(layerFactory, VisualizationType.GEO)

  const encoding = {
    position: {
      coordinates: {
        field: 'location',
      },
    },
  } as any
  const plainLayer = {type: LayerType.image, encoding}
  const layer = layerFactory.createLayer(plainLayer as PlainLayer)

  const mutatedLayer = layerMutator.mutate(layer, {type: LayerType.polygon})
  expect(mutatedLayer.encoding.position?.coordinates?.field).toEqual('location')
})

test('force correct scale type', () => {
  const columns = new Columns()
  columns.push(new Column({name: 'type', quantitative: false}))
  columns.push(new Column({name: 'temperature', quantitative: true}))

  const query = new Query({name: 'assets', dataSource: 'hopara', columns})
  const queries = new Queries()
  queries.push(query)

  const layerFactory = new LayerFactory({queries})
  const layerMutator = new LayerMutator(layerFactory, VisualizationType.GEO)

  const categoricalEncoding = { color: { field: 'temperature' } }
  const plainLayer = {type: LayerType.icon, data: { source: 'hopara', query: 'assets' }} as any
  plainLayer.encoding = categoricalEncoding

  const layer = layerFactory.createLayer(plainLayer)
  expect(layer.encoding.color?.scale.type).toEqual(ColorScaleType.GROUPED)

  const typeColorEncoding = new ColorEncoding({field: 'type', scale: { type: ColorScaleType.GROUPED }})
  let mutatedLayer = layerMutator.updateEncoding(layer, typeColorEncoding, 'color')
  expect(mutatedLayer.encoding.color?.scale.type).toEqual(ColorScaleType.SORTED)

  const temperatureColorEncoding = new ColorEncoding({field: 'temperature', scale: { type: ColorScaleType.SORTED }})
  mutatedLayer = layerMutator.updateEncoding(layer, temperatureColorEncoding, 'color')
  expect(mutatedLayer.encoding.color?.scale.type).toEqual(ColorScaleType.GROUPED)
})
