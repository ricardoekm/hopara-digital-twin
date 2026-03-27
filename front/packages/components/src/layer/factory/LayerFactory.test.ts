import {Column, ColumnType, Columns, Queries, Query} from '@hopara/dataset'
import {LayerFactory} from './LayerFactory'
import {LayerType} from '../LayerType'
import {ZoomRange} from '../../zoom/ZoomRange'
import {ColorScaleType, Data, Encodings, SizeEncoding} from '@hopara/encoding'
import {Layers} from '../Layers'
import {Layer, PlainLayer} from '../Layer'

test('create layer preserve raw', () => {
  const plainLayers = [
    {
      'id': 'my-layer',
      'data': {
        'source': 'teste',
        'query': 'default',
      },
      'name': 'Layer 1',
      'type': 'Circle',
      'zoomRange': {
        'max': 9.5,
        'min': 3,
      },
      'position': {
        'x': {
          'field': 'any-field',
        },
        'y': {
          'field': 'any-field',
        },
      },
    },
  ]

  const layerFactory = new LayerFactory({})
  const layers = layerFactory.createLayers(plainLayers)

  expect(layers[0].raw).toEqual({
    'id': 'my-layer',
    'data': {
      'source': 'teste',
      'query': 'default',
    },
    'name': 'Layer 1',
    'type': 'Circle',
    'zoomRange': {
      'max': 9.5,
      'min': 3,
    },
    'position': {
      'x': {
        'field': 'any-field',
      },
      'y': {
        'field': 'any-field',
      },
    },
  })
})

test('create layer fills visible zoom range', () => {
  const plainLayer = {
    id: 'my-layer',
    type: LayerType.circle,
    visible: {
      value: true,
    },
  } as any

  const zoomRange = new ZoomRange({min: {value: 0}, max: {value: 10}})
  const layerFactory = new LayerFactory({zoomRange})
  const layer = layerFactory.createLayer(plainLayer)

  expect(layer).toMatchObject({
    id: 'my-layer',
    type: 'circle',
    visible: {
      value: true,
      zoomRange: {
        min: {
          value: 0,
        },
        max: {
          value: 10,
        },
      },
    },
  })
})

test('create layer fills child visible value', () => {
  const plainLayer = {
    id: 'my-layer',
    type: LayerType.composite,
    visible: {
      value: true,
    },
    children: [
      {
        id: 'my-child-layer',
        type: LayerType.circle,
      },
    ],
  } as any

  const zoomRange = new ZoomRange({min: {value: 0}, max: {value: 10}})
  const layerFactory = new LayerFactory({zoomRange})
  const layer = layerFactory.createLayer(plainLayer)

  expect(layer).toMatchObject({
    id: 'my-layer',
    type: LayerType.composite,
    visible: {
      value: true,
      zoomRange: {
        min: {
          value: 0,
        },
        max: {
          value: 10,
        },
      },
    },
    children: [
      {
        id: 'my-child-layer',
        type: LayerType.circle,
        visible: {
          value: true,
          zoomRange: {
            min: {
              value: 0,
            },
            max: {
              value: 10,
            },
          },
        },
      },
    ],
  })
})

test('create layer fills child with parent condition', () => {
  const plainLayer = {
    id: 'my-layer',
    type: LayerType.composite,
    visible: {
      value: true,
      condition: {
        test: {
          field: 'my-field'
        },
      },
    },
    children: [
      {
        id: 'my-child-layer',
        type: LayerType.circle,
      },
    ],
  } as any

  const zoomRange = new ZoomRange({min: {value: 0}, max: {value: 10}})
  const layerFactory = new LayerFactory({zoomRange})
  const layer = layerFactory.createLayer(plainLayer)

  expect(layer).toMatchObject({
    id: 'my-layer',
    type: LayerType.composite,
    visible: {
      value: true,
      zoomRange: {
        min: {
          value: 0,
        },
        max: {
          value: 10,
        },
      },
    },
    children: [
      {
        id: 'my-child-layer',
        type: LayerType.circle,
        visible: {
          value: true,
          condition: {
            parentTest: {
              field: 'my-field',
            }
          },
          zoomRange: {
            min: {
              value: 0,
            },
            max: {
              value: 10,
            },
          },
        },
      },
    ],
  })
})

test('create layer fills default props', () => {
  const layerDefaults = {
    circle: {
      encoding: {
        color: {
          value: '#000000',
          opacity: 1,
        },
      },
    },
  } as any

  const layerFactory = new LayerFactory({layerDefaults})
  const layer = layerFactory.createLayer({type: LayerType.circle} as PlainLayer)
  expect(layer.encoding.getColor()?.value).toEqual('#000000')
})

test('if has range doesnt fill scale', () => {
  const layerDefaults = {
    circle: {
      encoding: {
        color: {
          scale: {
            scheme: 'redYellowGreen',
          },
        },
      },
    },
  } as any

  const plainLayer = {
    type: LayerType.circle,
    encoding: {
      color: {
        scale: {
          colors: [
            '#000000',
            '#ffffff',
          ],
        },
      },
    },
  }

  const layerFactory = new LayerFactory({layerDefaults})
  const layer = layerFactory.createLayer(plainLayer as any)
  expect(layer.encoding.getColor()?.scale.scheme).toBeUndefined()
})

test('fill query id as default image key', () => {
  const columns = new Columns()
  columns.push(new Column({name: 'floorplan_id', primaryKey: true}))
  const query = new Query({name: 'floorplans', dataSource: 'hopara', columns})
  const queries = new Queries()
  queries.push(query)

  const plainLayer = {type: LayerType.image, data: {source: 'hopara', query: 'floorplans'}, encoding: {image: {}}}

  const layerFactory = new LayerFactory({queries})
  const layer = layerFactory.createLayer(plainLayer as any)
  expect(layer.encoding.image?.field).toEqual('floorplan_id')
  expect(layer.encoding.image?.resolution).toBeUndefined()
})

test('if image has value do not fill key', () => {
  const columns = new Columns()
  columns.push(new Column({name: 'floorplan_id', primaryKey: true}))
  const query = new Query({name: 'floorplans', dataSource: 'hopara', columns})
  const queries = new Queries()
  queries.push(query)

  const plainLayer = {type: LayerType.image, data: {source: 'hopara', query: 'floorplans'}, encoding: {image: { value: 'table'}}}

  const layerFactory = new LayerFactory({queries})
  const layer = layerFactory.createLayer(plainLayer as any)
  expect(layer.encoding.image?.field).toBeUndefined()
})

test('fill query id as default model key', () => {
  const columns = new Columns()
  columns.push(new Column({name: 'asset_id', primaryKey: true}))
  const query = new Query({name: 'assets', dataSource: 'hopara', columns})
  const queries = new Queries()
  queries.push(query)

  const plainLayer = {type: LayerType.model, data: {source: 'hopara', query: 'assets'}, encoding: {model: {}}}

  const layerFactory = new LayerFactory({queries})
  const layer = layerFactory.createLayer(plainLayer as any)
  expect(layer.encoding.model?.field).toEqual('asset_id')
})

test('layer prop has priority over defaults', () => {
  const layerDefaults = {
    circle: {
      encoding: {
        color: {
          value: '#000000',
          opacity: 1,
        },
      },
    },
  } as any

  const layerFactory = new LayerFactory({layerDefaults})
  const encoding = {
    color: {
      value: '#ffffff',
      opacity: 1,
    },
  } as any
  const layer = layerFactory.createLayer({type: LayerType.circle, encoding} as PlainLayer)
  expect(layer.encoding.getColor()?.value).toEqual('#ffffff')
})

test('fill scope', () => {
  const layerFactory = new LayerFactory({scope: 'my-scope'})
  const encoding = {
    image: {
      value: 'id',
    },
    position: {},
  } as any
  const data = new Data({source: 'hopara', query: 'assets'})

  const layer = layerFactory.createLayer({type: LayerType.image, encoding, data} as PlainLayer)
  expect(layer.getPositionEncoding()?.scope).toEqual('my-scope')
  expect(layer.encoding.image?.scope).toEqual('assets-hopara-my-scope')
})

test('merge encodings', () => {
  const layerDefaults = {
    circle: {
      encoding: {
        color: {
          value: '#000000',
          opacity: 1,
        },
      },
    },
  } as any

  const layerFactory = new LayerFactory({layerDefaults})
  const encoding = new Encodings({
    size: new SizeEncoding({
        value: 10,
      },
    ),
  }) as any
  const layer = layerFactory.createLayer({type: LayerType.circle, encoding} as PlainLayer)
  expect(layer.encoding.getColor()?.value).toEqual('#000000')
  expect(layer.encoding.size?.getValue()).toEqual(10)
})

test('fill name', () => {
  const layers = new Layers()
  layers.push(new Layer({type: LayerType.circle} as PlainLayer))
  layers.push(new Layer({type: LayerType.polygon} as PlainLayer))

  const layerFactory = new LayerFactory({layers})
  const layer = layerFactory.createLayer({type: LayerType.circle} as PlainLayer)
  expect(layer.name).toEqual('Circle 2')
})

test('fill multiple name', () => {
  const plainLayers = new Layers()
  plainLayers.push(new Layer({type: LayerType.circle} as PlainLayer))
  plainLayers.push(new Layer({type: LayerType.circle} as PlainLayer))

  const layerFactory = new LayerFactory({})
  const layers = layerFactory.createLayers(plainLayers)
  expect(layers[0].name).toEqual('Circle 1')
  expect(layers[1].name).toEqual('Circle 2')
})

test('fill default color scale type', () => {
  const columns = new Columns()
  columns.push(new Column({name: 'type', quantitative: false}))
  columns.push(new Column({name: 'temperature', quantitative: true}))

  const query = new Query({name: 'assets', dataSource: 'hopara', columns})
  const queries = new Queries()
  queries.push(query)

  const layerFactory = new LayerFactory({queries})

  const categoricalEncoding = {color: {field: 'type'}}
  const plainLayer = {type: LayerType.icon, data: {source: 'hopara', query: 'assets'}} as any
  plainLayer.encoding = categoricalEncoding

  const categoricalLayer = layerFactory.createLayer(plainLayer as any)
  expect(categoricalLayer.encoding.color?.scale.type).toEqual(ColorScaleType.SORTED)
  plainLayer.encoding = {color: {field: 'temperature'}}

  const quantitativeLayer = layerFactory.createLayer(plainLayer as any)
  expect(quantitativeLayer.encoding.color?.scale.type).toEqual(ColorScaleType.GROUPED)
})


test('fill default text encoding', () => {
  const columns = new Columns()
  columns.push(new Column({name: 'name', type: ColumnType.STRING}))
  const query = new Query({name: 'assets', dataSource: 'hopara', columns})
  const queries = new Queries()
  queries.push(query)

  const plainLayer = {type: LayerType.text, data: {source: 'hopara', query: 'assets'}, encoding: {text: {}}}

  const layerFactory = new LayerFactory({queries})
  const layer = layerFactory.createLayer(plainLayer as any)
  expect(layer.encoding.text?.field).toEqual('name')
})
