import { Layer } from '../../Layer'
import { Layers } from '../../Layers'
import { LayerType } from '../../LayerType'
import { getRefLayerFilter } from './RefLayerFilter'
import { Encodings, PositionEncoding } from '@hopara/encoding'

const iconEncodings = new Encodings({position: new PositionEncoding({x: { field: 'x'}, y: {field: 'y'}})})
const iconLayer = new Layer({id: 'iconLayer', type: LayerType.icon, encoding: iconEncodings})

const imageEncodings = new Encodings({position: new PositionEncoding({coordinates: { field: 'geometry'}})})
const imageLayer = new Layer({id: 'imageLayer', type: LayerType.image, encoding: imageEncodings})

const polygonEncodings = new Encodings({position: new PositionEncoding({coordinates: { field: 'geometry'}})})
const polygonLayer = new Layer({id: 'polygonLayer', type: LayerType.polygon, encoding: polygonEncodings})


test('Not coordinates based can point to coordinates based', () => {
  const layers = new Layers(imageLayer, iconLayer)

  const refLayers = layers.filter(getRefLayerFilter(iconLayer))
  expect(refLayers).toHaveLength(1)
  expect(refLayers[0].getId()).toBe('imageLayer')
})

test('Coordinates based can point to same layer type', () => {
  const anotherImageLayer = new Layer({id: 'anotherImageLayer', type: LayerType.image, encoding: imageEncodings})
  const layers = new Layers(imageLayer, iconLayer, anotherImageLayer)

  const refLayers = layers.filter(getRefLayerFilter(imageLayer))
  expect(refLayers).toHaveLength(1)
  expect(refLayers[0].getId()).toBe('anotherImageLayer')
})

test('Polygon can point to images', () => {
  const layers = new Layers(imageLayer, iconLayer, polygonLayer)

  const refLayers = layers.filter(getRefLayerFilter(polygonLayer))
  expect(refLayers).toHaveLength(1)
  expect(refLayers[0].getId()).toBe('imageLayer')
})
