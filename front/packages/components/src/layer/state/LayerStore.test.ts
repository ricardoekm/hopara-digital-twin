import { getAnyData } from '../../query/Data.test'
import { Layer } from '../Layer'
import { LayerFactory } from '../factory/LayerFactory'
import { LayerMutator } from '../mutator/LayerMutator'
import { LayerType } from '../LayerType'
import { Layers } from '../Layers'
import { LayerStore } from './LayerStore'
import {VisualizationType} from '../../visualization/Visualization'
import { getAnyLayer, getAnyTemplateLayer } from '../Layer.test'

const layerFactory = new LayerFactory({})
const layerMutator = new LayerMutator(layerFactory, VisualizationType.GEO)

test('update child layer', () => {
  const layers = new Layers(
    layerFactory.createLayer({
      id: 'parentId',
      type: LayerType.composite,
      children: new Layers(new Layer({id: 'childId', type: LayerType.circle, data: getAnyData(), parentId: 'parentId'})),
    }),
  )

  const layerStore = new LayerStore({layers, layerMutator})
  const updatedStore = layerStore.updateLayer('parentId-childId', {type: LayerType.text})
  const updatedLayer = updatedStore.layers.getById('parentId')
  expect(updatedLayer?.raw).toMatchObject({
    id: 'parentId',
    type: LayerType.composite,
    children: [{
      id: 'childId',
      type: LayerType.text,
    }],
  })
})

test('eject template', () => {
  const template = getAnyTemplateLayer()
  const layers = new Layers(template)
  const layerStore = new LayerStore({layers, layerMutator})
  const updatedLayerStore = layerStore.ejectLayer(template.getId())
  expect(updatedLayerStore.layers.length).toBe(1)
  expect(updatedLayerStore.layers[0].type).toBe(LayerType.composite)
  expect(updatedLayerStore.layers[0].raw.data).toEqual(template.data)
  expect(updatedLayerStore.layers[0].raw.name).toEqual(template.name)
})

test('upsert child layer clear data field', () => {
  const layerFactory = new LayerFactory({})
  const child = new Layer({id: 'any-layer2', parentId: 'any-layer-1', type: LayerType.circle, data: getAnyData()})
  const parent = new Layer({id: 'any-layer-1', data: getAnyData(), type: LayerType.composite, children: new Layers(child)})
  const layers = new Layers(layerFactory.createLayer(parent as any))

  const layerMutator = new LayerMutator(layerFactory, VisualizationType.GEO)
  const layerStore = new LayerStore({layers, layerMutator})
  const updatedStore = layerStore.upsertLayer(child)
  const updatedLayer = updatedStore.layers.getById('any-layer-1') as any
  expect(updatedLayer.raw.children[0].data).toBeUndefined()
})

test('lock other layers', () => {
  const layer1 = getAnyLayer({id: 'id-1', data: getAnyData({source: 'source-1'})})
  const layer2 = getAnyLayer({id: 'id-2'})

  let layerStore = new LayerStore({layers: new Layers(layer1, layer2)})
  layerStore = layerStore.lockOtherLayers('id-1')

  expect(layerStore.layers[0].currentLocked).toBe(false)
  expect(layerStore.layers[1].currentLocked).toBe(true)
})

test('dont lock layers with same rowset id', () => {
  const layer1 = getAnyLayer({id: 'id-1'})
  const layer2 = getAnyLayer({id: 'id-2'})

  let layerStore = new LayerStore({layers: new Layers(layer1, layer2)})
  layerStore = layerStore.lockOtherLayers('id-1')

  expect(layerStore.layers[0].currentLocked).toBeFalsy()
  expect(layerStore.layers[1].currentLocked).toBeFalsy()
})
