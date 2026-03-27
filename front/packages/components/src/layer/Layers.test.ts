import {Range} from '@hopara/spatial'
import {Layer} from './Layer'
import {Layers} from './Layers'
import {getAnyLayer, getAnyVisible} from './Layer.test'
import {Encodings, PositionEncoding} from '@hopara/encoding'
import {getAnyData} from '../query/Data.test'
import {Visible} from './Visible'
import {ZoomRange} from '../zoom/ZoomRange'
import {LayerType} from './LayerType'

test('get visible data returns the unique data of visible layers', () => {
  const layers = new Layers(
    getAnyLayer({
      id: 'solar-layer1',
      visible: {zoomRange: new Range({min: 1, max: 10})},
      data: {source: 'source', query: 'query1'},
    }),
    getAnyLayer({
      id: 'solar-layer2',
      zoomRange: new Range({min: 1, max: 10}),
      query: 'query1',
  }))

  const targetRowsets = layers.getRowsets(1)
  expect(targetRowsets.length).toStrictEqual(1)
  expect(targetRowsets[0].data.query).toStrictEqual('query1')
})

test('get root layer', () => {
  const layers = new Layers(
      getAnyLayer({
        id: 'parentLayer',
        type: LayerType.template,
        children: new Layers(
          getAnyLayer({
            id: 'childLayer',
            parentId: 'parentLayer'
          })
        )
    })
  )

  const rootLayer = layers.getRootLayer('parentLayer-childLayer')
  expect(rootLayer?.getId()).toEqual('parentLayer')
})

test('if the layer has no query returns empty', () => {
  const layers = new Layers(getAnyLayer({
    id: 'solar-layer1',
    visible: {zoomRange: new Range({min: 1, max: 10})},
    data: undefined,
  }))

  const targetRowsets = layers.getRowsets(1)
  expect(targetRowsets.length).toStrictEqual(0)
})

test('get visible data has min inclusive', () => {
  const layers = new Layers(
    getAnyLayer({
      id: 'solar-layer1',
      visible: {zoomRange: new Range({min: 0, max: 10})},
      data: {source: 'source', query: 'query1'},
    }),
    getAnyLayer({
      id: 'solar-layer2',
      visible: {zoomRange: new Range({min: 0, max: 10})},
      data: {source: 'source', query: 'query1'},
    }),
  )

  const targetRowsets = layers.getRowsets(0)
  expect(targetRowsets.length).toStrictEqual(1)
  expect(targetRowsets[0].data.query).toStrictEqual('query1')
})

test('get by id', () => {
  const layer1 = getAnyLayer({id: 'solar-layer1', visible: {zoomRange: new Range({min: 0, max: 5})}})
  const layer2 = getAnyLayer({id: 'solar-layer2', visible: {zoomRange: new Range({min: 5, max: 10})}})

  const layers = new Layers(layer1, layer2)

  expect(layers.getById('solar-layer1')).toEqual(layer1)
  expect(layers.getById('solar-layer2')).toEqual(layer2)
})

test('get by id also find parent', () => {
  const childLayer = getAnyLayer({id: 'child-layer', parentId: 'parent-layer', 
                                  visible: {zoomRange: new Range({min: 5, max: 10})}})
  const parentLayer = getAnyLayer({
    id: 'parent-layer',
    type: LayerType.composite,
    visible: {zoomRange: new Range({min: 0, max: 5})},
    children: new Layers(childLayer),
  })
  const layers = new Layers(parentLayer)

  expect(layers.getById(parentLayer.getId())).toEqual(parentLayer)
  expect(layers.getById(childLayer.getId())).toEqual(parentLayer)
})

test('get with floor', () => {
  const encoding = new Encodings({})
  const layer1 = getAnyLayer({id: 'solar-layer1', type: LayerType.image, encoding})

  const floorPositionEncoding = new PositionEncoding({floor: {field: 'floor'}})
  const floorEncoding = new Encodings({position: floorPositionEncoding})
  const layer2 = getAnyLayer({id: 'solar-layer2', type: LayerType.icon, encoding: floorEncoding})

  const layers = new Layers(layer1, layer2)
  expect(layers.getWithFloor().length).toEqual(1)
  expect(layers.getWithFloor()[0].getId()).toEqual(layer2.getId())
})

test('get with floor prioritize image', () => {
  const floorPositionEncoding = new PositionEncoding({floor: {field: 'floor'}})
  const encoding = new Encodings({position: floorPositionEncoding})
  const layer1 = getAnyLayer({id: 'solar-layer1', type: LayerType.image, encoding})
  const layer2 = getAnyLayer({id: 'solar-layer2', type: LayerType.icon, encoding})

  const layers = new Layers(layer1, layer2)
  expect(layers.getWithFloor().length).toEqual(1)
  expect(layers.getWithFloor()[0].getId()).toEqual(layer1.getId())
})

test('some has floor position', () => {
  const layers = new Layers(
    new Layer({id: 'my-layer1', type: LayerType.circle, visible: getAnyVisible(), data: getAnyData()}),
    new Layer({
      id: 'my-layer2',
      type: LayerType.circle,
      visible: getAnyVisible(),
      data: getAnyData(),
      encoding: new Encodings({
        position: new PositionEncoding({
          x: {field: 'xField'},
          y: {field: 'yField'},
          floor: {field: 'floorField'},
        }),
      }),
    }),
  )
  expect(layers.someWithFloor()).toEqual(true)
})

test('should get visible layers with floor', () => {
  const layers = new Layers(
    new Layer({
      id: 'my-layer1',
      type: LayerType.circle,
      visible: new Visible({
        value: true,
        zoomRange: new ZoomRange({min: {value: 4}, max: {value: 10}}),
      }),
      data: getAnyData(),
    }),
    new Layer({
      id: 'my-layer2',
      type: LayerType.circle,
      visible: new Visible({
        value: true,
        zoomRange: new ZoomRange({min: {value: 6}, max: {value: 10}}),
      }),
      encoding: new Encodings({
        position: new PositionEncoding({floor: {field: 'floorField'}}),
      }),
      data: getAnyData(),
    }),
    new Layer({
      id: 'my-layer3',
      type: LayerType.circle,
      visible: new Visible({
        value: true,
        zoomRange: new ZoomRange({min: {value: 8}, max: {value: 15}}),
      }),
      encoding: new Encodings({
        position: new PositionEncoding({floor: {field: 'floorField'}}),
      }),
      data: getAnyData(),
    }),
  )

  expect(layers.getWithFloor().getVisibles(5).length).toBe(0)
  expect(layers.getWithFloor().getVisibles(8).length).toBe(2)
})

test('Get searchable layers returns only one per rowset', () => {
  const layers = new Layers(
    getAnyLayer({
      id: 'layer1',
      visible: {zoomRange: new Range({min: 1, max: 10})},
      data: {source: 'source', query: 'query1'},
    }),
    getAnyLayer({
      id: 'layer2',
      zoomRange: new Range({min: 1, max: 10}),
      data: {source: 'source', query: 'query1'},
  }))

  const searchables = layers.getSearchables()
  expect(searchables.length).toBe(1)
  expect(searchables[0].getId()).toBe('layer1')
})
