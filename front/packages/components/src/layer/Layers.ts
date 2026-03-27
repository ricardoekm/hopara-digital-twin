import { findIndex, findLast, isEmpty, isNil, uniq, uniqBy } from 'lodash/fp'
import { Layer } from './Layer'
import { fromZoom, hasData } from './Filters'
import { Rowsets } from '../rowset/Rowsets'
import { Rowset } from '../rowset/Rowset'
import { LayerType } from './LayerType'
import { QueryKey } from '@hopara/dataset/src/query/Queries'
import { isGoogleMap } from '../map/MapStyleFactory'
import { PositionType } from '@hopara/encoding'

function onlyRowset() {
  return (layer: Layer) => layer.getRowset()
}

export class Layers extends Array<Layer> {
  clone() {
    return new Layers(...this)
  }

  toRaw(): any {
    return this.map((layer) => layer.toRaw())
  }

  constructor(...layers: Layer[]) {
    if (layers.length && typeof layers[0] === 'number') {
      super(layers[0])
    } else {
      super()
      layers.forEach((layer) => layer && super.push(layer))
    }
  }

  filter(filterFunc): Layers {
    const filteredItems = super.filter(filterFunc)
    return new Layers(...filteredItems)
  }

  flatLayers() {
    return this.map((layer) => layer.getFlatChildren())
      .flat()
      .concat(this)
  }

  getById(
    layerId?: string,
    returnParent = true,
    recursive = true
  ): Layer | undefined {
    const layerToSearch = recursive ? this.flatLayers() : this
    const layer = layerToSearch.find((l) => l.getId() === layerId)
    if (returnParent && layer?.hasParent()) {
      return this.getById(layer.parentId, true)
    }
    return layer
  }

  getRootLayer(layerId?: string): Layer | undefined {
    const layers = this.flatLayers()
    const childLayer = layers.find((layer) => layer.getId() === layerId)!
    if ( childLayer.hasParent()) {
      return this.getRootLayer(childLayer.parentId)
    }

    return childLayer
  }

  getByRowsetId(rowsetId: string): Layer | undefined {
    return findLast((layer) => layer.getRowsetId() === rowsetId, this)
  }

  hasId(layerId?: string, recursive = true) {
    if (!layerId) {
      return false
    }

    return !!this.getById(layerId, false, recursive)
  }

  upsertLayer(layer: Layer, addInBeginning?: boolean): Layers {
    const cloned = this.clone()
    const layerIndex = findIndex((l) => l.getId() === layer.getId(), cloned)
    if (layerIndex > -1) {
      cloned.splice(layerIndex, 1, layer)
    } else if (addInBeginning) {
        cloned.unshift(layer)
      } else {
        cloned.push(layer)
      }
    return cloned
  }

  getMostRecentLastModified() {
    let lastModifieds = this.map((layer) => layer.getLastModified())
    lastModifieds = lastModifieds.filter((lastModified) => !isNil(lastModified))
    if (isEmpty(lastModifieds)) {
      return 0
    }

    return Math.max(...lastModifieds.map((lm) => lm!.getTime()))
  }

  cleanRowsets(targetRowsets: (Rowset | undefined)[]) {
    const validRowsets = targetRowsets.filter(
      (rowset): rowset is Rowset => !!rowset
    )
    return new Rowsets(...uniqBy((rowset) => rowset.getId(), validRowsets))
  }

  getLockeds() {
    return this.filter((layer: Layer) => !!layer.getLocked())
  }

  getRowsets(zoom?: number): Rowsets {
    if (zoom === undefined || zoom < 0) return new Rowsets()

    const layers = this.filter(hasData).filter(fromZoom(zoom))
    const rowsets = layers.map(onlyRowset())
    return this.cleanRowsets(rowsets)
  }

  getUniqueRowsets() {
    const rowsets = this.map(onlyRowset())
    return this.cleanRowsets(rowsets)
  }

  getAllRowsetIds(): string[] {
    return uniq(this.map((layer) => layer.getRowsetId()))
  }

  renderable(rowsets: Rowsets): Layers {
    return this.filter((layer: Layer) => layer.shouldRender(rowsets))
  }

  someWithFloor(): boolean {
    return this.some(
      (layer) =>
        layer.encoding?.position?.hasFloor && layer.encoding.position.hasFloor()
    )
  }

  moveLayer(layerId: string, steps: number) {
    const cloned = this.clone()
    const layerIndex = cloned.findIndex((layer) => layer.getId() === layerId)
    const element = cloned[layerIndex]
    cloned.splice(layerIndex, 1)
    cloned.splice(layerIndex + steps, 0, element)
    return cloned
  }

  deleteLayer(layerId: string) {
    const cloned = this.clone()
    const layerIndex = cloned.findIndex((layer) => layer.getId() === layerId)

    if (layerIndex !== -1 && cloned[layerIndex]) {
      cloned.splice(layerIndex, 1)
    }

    return cloned
  }

  getWithFloor(): Layers {
    const imageCandidates = this.filter((layer: Layer) => {
      return (
        layer.isType(LayerType.image) && layer.encoding?.position?.hasFloor()
      )
    })

    if (imageCandidates.length > 0) {
      return imageCandidates
    }

    return this.filter((layer: Layer) => {
      return layer.encoding?.position?.hasFloor()
    })
  }

  getVisibles(zoom?: number): Layers {
    if (isNil(zoom)) return new Layers()
    return this.filter((layer: Layer) => layer.isVisible(zoom))
  }

  insertAt(layer: Layer, position: number) {
    const cloned = this.clone()
    cloned.splice(position, 0, layer)
    return cloned
  }

  getByQueryKey(queryKey: QueryKey) {
    return this.filter(
      (layer: Layer) =>
        layer.getQueryKey().query === queryKey.query &&
        layer.getQueryKey().source === queryKey.source
    )
  }

  mergeLayer(layer: Layer, addInBeginning?: boolean): Layers {
    const cloned = this.clone()

    if (layer.hasParent()) {
      const parentLayer = cloned.getById(layer.parentId)!.clone()
      parentLayer.children = parentLayer.children?.upsertLayer(layer)
      return cloned.upsertLayer(parentLayer, addInBeginning)
    }

    return cloned.upsertLayer(layer, addInBeginning)
  }

  hasGoogleMapLayer() : boolean {
    return this.some((layer) => layer.isType(LayerType.map) && isGoogleMap(layer.encoding?.map?.value))
  }

  getSearchables() {
    const layers = this.filter((layer: Layer) => layer.isFetchable() && !layer.getTransform() && !layer.getPositionEncoding()?.isOfType(PositionType.REF))
    const uniqueLayers = uniqBy((layer: Layer) => layer.getRowsetId(), layers)
    return new Layers(...uniqueLayers)
  }
}
