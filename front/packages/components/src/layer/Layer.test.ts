import {Layer, PlainLayer} from './Layer'
import {LayerType} from './LayerType'
import {plainToInstance} from 'class-transformer'
import {Range} from '@hopara/spatial'
import {clone} from '@hopara/object/src/clone'
import {ColorEncoding, Data, Encodings, ImageEncoding, PositionEncoding, SizeEncoding} from '@hopara/encoding'
import {Visible} from './Visible'
import {getAnyData} from '../query/Data.test'
import {ZoomRange} from '../zoom/ZoomRange'
import { Layers } from './Layers'
import { PlaceTransform } from '../transform/PlaceTransform'
import { LayerFactory } from './factory/LayerFactory'

export function getAnyZoomRange(props?: Partial<ZoomRange>): ZoomRange {
  return new ZoomRange({
    min: {value: 4},
    max: {value: 10},
    ...props,
  })
}

export function getAnyVisible() : Visible {
  return new Visible({
      zoomRange: getAnyZoomRange(),
      value: true,
  })
}

const anyId = 'my-layer'
const anyType = LayerType.circle

const anyLayer = new Layer({
  id: 'my-layer1',
  type: LayerType.circle,
  visible: getAnyVisible(),
  data: getAnyData(),
  encoding: new Encodings({
    position: new PositionEncoding({
      x: {field: 'longitude'},
      y: {field: 'latitude'},
    }),
    size: new SizeEncoding({value: 10}),
    color: new ColorEncoding({value: 'red'}),
  }),
})

export function getAnyLayer(props:any = {}) : Layer {
  return clone<Layer>(anyLayer, props)
}

export function getAnyTemplateLayer(props:any = {}) : Layer {
  const layerFactory = new LayerFactory({layerTemplates: []})
  const grandChildLayer = layerFactory.createLayer({type: LayerType.circle, id: 'circleId', parentId: 'templateId-compositeId'})
  const grandChildren = new Layers(grandChildLayer)
  
  const childLayer = layerFactory.createLayer({type: LayerType.composite, id: 'compositeId', parentId: 'templateId', children: grandChildren})
  const children = new Layers(childLayer)
  
  const anyTemplateLayer = layerFactory.createLayer({type: LayerType.template, 
                                                     id: 'templateId', 
                                                     name: 'templateName',
                                                     template: { id: 'alerting-icon' } as any,
                                                     data: { source: 'hopara', query: 'my-query' }, 
                                                    } as PlainLayer)
  anyTemplateLayer.children = children
  return clone<Layer>(anyTemplateLayer, props)
}

test('Zoom range has min inclusive and max exclusive', () => {
  const zoomRange = new Range({min: 2, max: 8})
  const layer = new Layer({id: anyId, type: anyType, visible: {zoomRange} as any, data: getAnyData()})

  expect(layer.belongsToZoom(2)).toBeTruthy()
  expect(layer.belongsToZoom(8)).toBeFalsy()
})

test('Get render children', () => {
  const template = getAnyLayer({type: LayerType.template})
  const composite = getAnyLayer({type: LayerType.composite})
  const child1 = getAnyLayer({type: LayerType.circle})
  const child2 = getAnyLayer({type: LayerType.icon})

  composite.children = new Layers(child1, child2)
  template.children = new Layers(composite)

  expect(template.getRenderLayers()).toStrictEqual(new Layers(child1, child2))
  expect(composite.getRenderLayers()).toStrictEqual(new Layers(child1, child2))
})

test('Get flat children', () => {
  const template = getAnyLayer({type: LayerType.template})
  const composite = getAnyLayer({type: LayerType.composite})
  const child1 = getAnyLayer({type: LayerType.circle})
  const child2 = getAnyLayer({type: LayerType.icon})

  composite.children = new Layers(child1, child2)
  template.children = new Layers(composite)

  expect(template.getFlatChildren()).toStrictEqual(new Layers(composite, child1, child2))
  expect(composite.getFlatChildren()).toStrictEqual(new Layers(child1, child2))
})

test('Is coordinate based if is template and has polygon kid', () => {
  const template = getAnyLayer({type: LayerType.template})
  const composite = getAnyLayer({type: LayerType.composite})
  const child1 = getAnyLayer({type: LayerType.polygon})

  composite.children = new Layers(child1)
  template.children = new Layers(composite)

  expect(template.isCoordinatesBased()).toBeTruthy()
})

test('Is renderable if has all required encodings as renderable', () => {
  const imageEncoding = new ImageEncoding({field: 'floorplan_id'})
  const layer = getAnyLayer({
    'type': 'image',
    'encoding': {
      'image': imageEncoding,
    },
  })
  expect(layer.isRenderable()).toBeFalsy()

  layer.encoding.position = new PositionEncoding({coordinates: {field: 'location'}})
  expect(layer.isRenderable()).toBeTruthy()
})

test('Line layer is renderable with one axis', () => {
  const layer = getAnyLayer({
    'type': 'line',
    'encoding': {
      'position': new PositionEncoding({y: {field: 'temperature'}}),
      'size': new SizeEncoding({value: 10}),
    },
  })
  
  expect(layer.isRenderable()).toBeTruthy()
})

test('If visible is toogled to false isnt renderable', () => {
  const layer = getAnyLayer({
    'type': 'line',
    'encoding': {
      'position': new PositionEncoding({y: {field: 'temperature'}}),
      'size': new SizeEncoding({value: 10}),
    },
    'visible': new Visible({value: false}),
  })
  
  expect(layer.isRenderable()).toBeFalsy()
})

test('Is fetchable if has all required encodings as renderable', () => {
  const imageEncoding = new ImageEncoding({field: 'floorplan_id'})
  const layer = getAnyLayer({
    'type': 'image',
    'encoding': {
      'image': imageEncoding,
    },
  })
  expect(layer.isFetchable()).toBeFalsy()

  layer.encoding.position = new PositionEncoding({coordinates: {field: 'location'}})
  expect(layer.isFetchable()).toBeTruthy()
})

test('If min is not filled assumes zero', () => {
  const zoomRange = new Range({max: 8})
  const layer = new Layer({id: anyId, type: anyType, visible: {zoomRange} as any, data: getAnyData()})

  expect(layer.belongsToZoom(0)).toBeTruthy()
  expect(layer.belongsToZoom(8)).toBeFalsy()
})

test('If no zoom range is specified apply to all', () => {
  const zoomRange = new Range({})
  const layer = new Layer({id: anyId, type: anyType, visible: {zoomRange} as any, data: getAnyData()})
  const layer2 = new Layer({id: anyId, type: anyType, data: getAnyData()})

  expect(layer.belongsToZoom(0)).toBeTruthy()
  expect(layer.belongsToZoom(8)).toBeTruthy()

  expect(layer2.belongsToZoom(0)).toBeTruthy()
  expect(layer2.belongsToZoom(8)).toBeTruthy()
})

test('If max is not filled assumes max int', () => {
  const zoomRange = new Range({min: 6})
  const layer = new Layer({id: anyId, type: anyType, visible: {zoomRange} as any, data: getAnyData()})

  expect(layer.belongsToZoom(5)).toBeFalsy()
  expect(layer.belongsToZoom(Number.MAX_SAFE_INTEGER - 1)).toBeTruthy()
})

test('Get target rowset returns undefined if the layer is not renderable', () => {
  const zoomRange = new Range({min: 1, max: 4})
  const layer = new Layer({id: anyId, type: anyType, visible: {zoomRange} as any, data: getAnyData()})

  const targetRowset = layer.getRowset()
  expect(targetRowset).toBeUndefined()
})

test('Parse test', () => {
  const layerJson = {
    id: 'CircleLayer',
    type: 'Circle',
    zoomRange: {min: 6, max: 8},
  }

  const layer = plainToInstance(Layer, layerJson)
  expect(layer instanceof Layer).toBeTruthy()
  expect(layer.belongsToZoom(6)).toBeTruthy()
})

test('Allow categorical axis', () => {
  const layer = new Layer({id: anyId, type: LayerType.bar})
  expect(layer.allowCategoricalAxis()).toBeTruthy()
})

test('Parse array test', () => {
  const layersJson = [{
    id: 'Circle',
    type: 'Circle',
  }]

  const layers = plainToInstance(Layer, layersJson)
  expect(layers[0] instanceof Layer).toBeTruthy()
})

test('If has place transform can move but cannot place', () => {
  const data = new Data({source: 'source', query: 'query', transform: new PlaceTransform({})})
  const layer = new Layer({id: anyId, type: LayerType.bar, data})
  expect(layer.canMove(true)).toBeTruthy()
  expect(layer.canPlace(true)).toBeFalsy()
})

test('Has color encoding considers child layers', () => {
  const colorEncoding = new ColorEncoding()
  const encodings = new Encodings({color: colorEncoding})
  const children = new Layers(new Layer({id: 'childId', type: LayerType.circle, encoding: encodings}))
  const layer = new Layer({id: anyId, type: LayerType.composite, children})
  expect(layer.hasColorEncoding()).toBeTruthy()
  expect(layer.getColorEncoding()).toStrictEqual(colorEncoding)
})

test('Has size encoding considers child layers', () => {
  const sizeEncoding = new SizeEncoding()
  const encodings = new Encodings({size: sizeEncoding})
  const children = new Layers(new Layer({id: 'childId', type: LayerType.circle, encoding: encodings}))
  const layer = new Layer({id: anyId, type: LayerType.composite, children})
  expect(layer.getSizeEncoding()).toStrictEqual(sizeEncoding)
})


test('Get last modified considers child layers', () => {
  const layer = new Layer()
  const oldDate = new Date()
  layer.setLastModified(oldDate)

  const childLayer = new Layer()
  const recentDate = new Date(oldDate.getTime() + 2000)
  childLayer.setLastModified(recentDate)

  layer.children = new Layers(childLayer)
  expect(layer.getLastModified()).toEqual(recentDate)
})

test('Can select', () => {
  const layer = new Layer()
  expect(layer.canSelect(true)).toBeTruthy()
})

test('Always can select image and model layers to allow upload', () => {
  const layer = new Layer({type: LayerType.image} as PlainLayer)
  expect(layer.canSelect(false)).toBeTruthy()
})

