import {isEmpty, isNil} from 'lodash/fp'
import {Layer} from '../Layer'
import {Layers} from '../Layers'
import {Query} from '@hopara/dataset'
import {LayerMutator} from '../mutator/LayerMutator'
import {LayerDefaults} from '../LayerDefaults'
import {LayerType} from '../LayerType'

export class LayerStore {
  layers: Layers
  editingId?: string
  openGroups: string[]
  previewLayer?: Layer
  userLocationLayers?: Layers
  isAdvancedMode: boolean
  selectedActionId?: string
  selectedDetailsField?: string
  layerDefaults: LayerDefaults
  layerMutator: LayerMutator
  isGoingBack: boolean

  constructor(props?: Partial<LayerStore>) {
    Object.assign(this, props)
    if (isNil(this.layers)) this.layers = new Layers()
    if (isNil(this.openGroups)) this.openGroups = []
    if (isNil(this.isAdvancedMode)) this.isAdvancedMode = false
    if (isNil(this.isGoingBack)) this.isGoingBack = false
  }

  clone(): LayerStore {
    return new LayerStore(this)
  }

  setIsGoingBack(isGoingBack: boolean): LayerStore {
    const cloned = this.clone()
    cloned.isGoingBack = isGoingBack
    return cloned
  }

  setLayerMutator(layerMutator: LayerMutator) {
    const cloned = this.clone()
    cloned.layerMutator = layerMutator
    return cloned
  }

  setLayers(layers: Layers): LayerStore {
    const cloned = this.clone()
    cloned.layers = layers
    return cloned
  }

  setLayerDefaults(layerDefaults: LayerDefaults) {
    const cloned = this.clone()
    cloned.layerDefaults = layerDefaults
    return cloned
  }

  upsertLayer(layer: Layer): LayerStore {
    const cloned = this.clone()
    if (layer.hasParent()) {
      const parentLayer = cloned.layers.getById(layer.parentId)!.clone()
      if (parentLayer.getFlatChildren().some((child) => child.getId() === layer.getId())) {
        const updatedParentLayer = this.layerMutator.updateChild(parentLayer, layer)
        cloned.layers = cloned.layers.upsertLayer(updatedParentLayer)      
      } else {
        const updatedParentLayer = this.layerMutator.upsertChild(parentLayer, layer)
        cloned.layers = cloned.layers.upsertLayer(updatedParentLayer)      
      }
    } else {
      cloned.layers = cloned.layers.upsertLayer(layer)
    }

    cloned.previewLayer = undefined

    return cloned
  }

  upsertLayers(layers: Layer[]): LayerStore {
    let cloned = this.clone()
    for (const layer of layers) {
      cloned = cloned.upsertLayer(layer)
    }
    return cloned
  }

  updateLayer(id: string, partialLayer: Partial<Layer>): LayerStore {
    const layer = this.layers.getById(id, false) as Layer
    const updatedLayer = this.layerMutator.mutate(layer, partialLayer)
    return this.upsertLayer(updatedLayer)
  }

  moveLayer(id: string, newIndex: number): LayerStore {
    const cloned = this.clone()
    cloned.layers = cloned.layers.moveLayer(id, newIndex)
    return cloned
  }

  deleteLayer(layer: Layer | undefined): LayerStore {
    if (!layer) {
      return this
    }

    const cloned = this.clone()

    if (layer.hasParent()) {
      const parentLayer = cloned.layers.getById(layer.parentId)
      const updatedParentLayer = this.layerMutator.deleteChild(parentLayer as Layer, layer.getId())
      cloned.layers = cloned.layers.upsertLayer(updatedParentLayer)
    } else {
      cloned.layers = cloned.layers.deleteLayer(layer.getId())
    }

    return cloned
  }

  duplicate(id: string) {
    const cloned = this.clone()
    const layer = cloned.layers.getById(id, false)
    if (!layer) return cloned

    if (layer.hasParent()) {
      const parentLayer = cloned.layers.getById(layer.parentId)!.clone()
      const childIndex = parentLayer.children!.findIndex((child) => child.getId() === id)
      const duplicatedChild = this.layerMutator.duplicate(layer)
      parentLayer.children = parentLayer.children!.insertAt(duplicatedChild, childIndex + 1)
      cloned.layers = cloned.layers.upsertLayer(parentLayer)
      return cloned.setSelectedLayer(duplicatedChild.getId())
    }

    const layerIndex = cloned.layers.findIndex((l) => l.getId() === id)
    const duplicatedLayer = this.layerMutator.duplicate(cloned.layers[layerIndex])
    const position = layerIndex + 1
    cloned.layers = cloned.layers.insertAt(duplicatedLayer, position)
    return cloned.setSelectedLayer(duplicatedLayer.getId())
  }

  setSelectedLayer(id?: string): LayerStore {
    const cloned = this.clone()
    cloned.editingId = id
    cloned.selectedActionId = undefined
    cloned.selectedDetailsField = undefined
    return cloned
  }

  removeSelectedLayer(): LayerStore {
    const cloned = this.clone()
    cloned.editingId = undefined
    return cloned
  }

  setOpenGroups(openGroups: string[]): LayerStore {
    const cloned = this.clone()
    cloned.openGroups = openGroups
    return cloned
  }

  setPreview(layer: Layer): LayerStore {
    const cloned = this.clone()
    cloned.previewLayer = layer
    return cloned
  }

  removePreview(): LayerStore {
    const cloned = this.clone()
    cloned.previewLayer = undefined
    return cloned
  }

  updateLayerDetails(id: string, query: Query, transformType?: string) {
    // We don't need to persist the details, so we don't call the mutator
    const layer = this.layers.getById(id) as Layer
    const columns = query.getColumns(transformType)
    layer.details.fields = layer.details.fields.rightJoinColumns(columns)
    return this.upsertLayer(layer)
  }

  resetUpdatedTimestamp(id: string) {
    const layer = this.layers.getById(id) as Layer
    layer.encoding?.resetUpdatedTimestamp()
    return this.upsertLayer(layer)
  }

  setAdvancedMode(enabled = false) {
    const cloned = this.clone()
    cloned.isAdvancedMode = enabled
    return cloned
  }

  getSelectedLayer(returnParent = false): Layer | undefined {
    return this.layers.getById(this.editingId, returnParent)
  }

  setSelectedAction(actionId?: string) {
    const cloned = this.clone()
    cloned.selectedActionId = actionId
    return cloned
  }

  setSelectedDetailsField(fieldId?: string) {
    const cloned = this.clone()
    cloned.selectedDetailsField = fieldId
    return cloned
  }

  toggleLockedLayers(referenceLayerId: string) {
    const cloned = this.clone()
    const referenceLayer = cloned.layers.getById(referenceLayerId)!
    const layersWithSameQueryKey = cloned.layers.getByQueryKey(referenceLayer.getQueryKey())
    const someLocked = layersWithSameQueryKey.some((layer) => layer.getLocked())
    const layers = layersWithSameQueryKey.map((layer) => layer.setLocked(!someLocked))
    return this.upsertLayers(layers)
  }

  lockOtherLayers(layerId: string) {
    const layer = this.layers.getById(layerId)!
    return this.upsertLayers(this.layers.map((otherLayer) => {
      return otherLayer.setLocked(layer.getRowsetId() !== otherLayer.getRowsetId())
    }))
  }

  unlockOtherLayers(layerId: string) {
    const layer = this.layers.getById(layerId)!
    return this.upsertLayers(this.layers.map((otherLayer) => {
      // Keep current layer's lock state, unlock all others
      if (layer.getRowsetId() === otherLayer.getRowsetId()) {
        return otherLayer // Keep current state
      }
      return otherLayer.setLocked(false) // Unlock others
    }))
  }

  ejectLayer(layerId: string): LayerStore {
    const layer = this.layers.getById(layerId)
    if (!layer || !layer.isType(LayerType.template)) return this
    const orphanChildren = layer.getChildren().map((child) => {
      let orphanChild = child.setParentId(undefined)
      orphanChild = this.layerMutator.mutate(orphanChild, {
        name: layer.name,
        data: layer.data,
        visible: layer.visible,
        details: layer.details,
        actions: layer.actions,
        parentId: undefined,
      })
      orphanChild = this.layerMutator.updateEncoding(orphanChild, layer.encoding?.config, 'config')
      return orphanChild
    })

    const updatedStore = this.deleteLayer(layer)
    return updatedStore.upsertLayers(orphanChildren)
  }

  getAllLayers() {
    let layers = this.layers
    if (this.previewLayer) {
      layers = layers.mergeLayer(this.previewLayer)
    }

    if (!isEmpty(this.userLocationLayers)) {
      for (const layer of this.userLocationLayers!) {
        layers = layers.mergeLayer(layer, true)
      }
    }

    return layers
  }
}

