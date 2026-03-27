import {Layer, PlainLayer} from '../Layer'
import {Layers} from '../Layers'
import {plainToInstance} from 'class-transformer'
import {Queries} from '@hopara/dataset'
import {ZoomRange} from '../../zoom/ZoomRange'
import {LayerDefaults} from '../LayerDefaults'
import {DynamicDefaultsFiller} from './DynamicDefaultsFiller'
import {StaticDefaultsFiller} from './StaticDefaultsFiller'
import {LayerType} from '../LayerType'
import {LayerTemplate} from '../template/domain/LayerTemplate'
import { VisualizationType } from '../../visualization/Visualization'
import { TemplateCompiler } from './TemplateCompiler'
import { Visible } from '../Visible'
import ViewState from '../../view-state/ViewState'
import { Encodings, SizeEncoding } from '@hopara/encoding'
import { isNil } from 'lodash'

export class LayerFactory {
  queries?: Queries
  zoomRange?: ZoomRange
  layerDefaults?: LayerDefaults
  layers?: Layers
  scope?: string
  layerTemplates: LayerTemplate[]
  visualizationType: VisualizationType
  viewState?: ViewState
  visualizationCreatedVersion?: string

  constructor(props: Partial<LayerFactory>) {
    Object.assign(this, props)
  }

  setQueries(queries: Queries) {
    return new LayerFactory({...this, queries})
  }

  getDynamicDefaultsFiller() {
    return new DynamicDefaultsFiller({queries: this.queries, 
                                      zoomRange: this.zoomRange, 
                                      scope: this.scope, 
                                      templates: this.layerTemplates, 
                                      visualizationType: this.visualizationType,
                                      visualizationCreatedVersion: this.visualizationCreatedVersion,
                                      viewState: this.viewState})
  }

  getTemplateCompiler() {
    return new TemplateCompiler(this.layerTemplates)
  }

  getStaticDefaultsFiller() {
    return new StaticDefaultsFiller(this.layerDefaults)
  }

  fillDefaults() {
    let clonedLayers = this.layers?.clone() ?? new Layers()
    clonedLayers.forEach((layer) => {
      const clonedLayer = layer.clone()
      this.getDynamicDefaultsFiller().fillDynamicDefaults(clonedLayer, this.layers as any)
      clonedLayers = clonedLayers?.upsertLayer(clonedLayer)
    })
    return clonedLayers
  }

  fillRaw(layer: Layer, plainLayer: PlainLayer, hasParent: boolean) {
    layer.raw = plainLayer

    // We'll persist the id
    layer.raw.id = (layer as any).id

    if (hasParent) {
      layer.raw = {
        ...layer.raw,
        data: {} as any,
      }
    }
  }

  fillParentData(childLayer: any, parentLayer?: Layer) {
    if (!parentLayer) {
      return
    }

    childLayer.parentId = parentLayer.getId()
    // Some defaults like color use the data
    childLayer.data = parentLayer.data
    childLayer.scale = parentLayer.scale

    if (!childLayer.encoding) {
      childLayer.encoding = new Encodings({})
    }
    
    childLayer.encoding.config = parentLayer.encoding?.config
    childLayer.encoding.position = parentLayer.encoding?.position

    if ( !isNil(parentLayer.encoding?.size?.referenceZoom) ) {
      if ( !childLayer.encoding.size ) {
        childLayer.encoding.size = new SizeEncoding()
      }

      if ( isNil(childLayer.encoding.size.referenceZoom) ) {
        childLayer.encoding.size.referenceZoom = parentLayer.encoding.size!.referenceZoom
      }
    }

    if ( !isNil(parentLayer.encoding?.size?.multiplier) ) {
      if ( !childLayer.encoding.size ) {
        childLayer.encoding.size = new SizeEncoding()
      }

      if ( isNil(childLayer.encoding.size.multiplier) ) {
        childLayer.encoding.size.multiplier = parentLayer.encoding.size!.multiplier
      }
    }

    if ( !isNil(parentLayer.encoding?.strokeSize?.referenceZoom) ) {
      if ( !childLayer.encoding.strokeSize ) {
        childLayer.encoding.strokeSize = new SizeEncoding()
      }

      if ( isNil(childLayer.encoding.strokeSize.referenceZoom) ) {
        childLayer.encoding.strokeSize.referenceZoom = parentLayer.encoding.strokeSize!.referenceZoom
      }
    }

    if (parentLayer.visible) {
      childLayer.visible = new Visible({
        ...childLayer.visible,
        value: parentLayer.visible.value,
        zoomRange: parentLayer.visible.zoomRange
      })

      if ( parentLayer.visible.condition ) {
        const condition = childLayer.visible.condition ?? { test: {} }
        condition.parentTest = parentLayer.visible.condition?.test
        childLayer.visible.condition = condition
      }
    }

    childLayer.encoding = childLayer.encoding.mergeWith(parentLayer.encoding)
  }

  getColorColumn(layer: Layer) {
    return this.getDynamicDefaultsFiller().getColorColumn(layer)
  }

  doCreate(plainLayer: PlainLayer, parentLayer?: Layer, plainLayers?:PlainLayer[]) {
    const layer = plainToInstance(Layer, this.getStaticDefaultsFiller().fillStaticDefaults(plainLayer)) as Layer

    this.fillParentData(layer, parentLayer)
    this.fillRaw(layer, plainLayer, !!parentLayer)
    this.getDynamicDefaultsFiller().fillDynamicDefaults(layer, plainLayers)

    if (layer.children?.length) layer.children = new Layers(...(plainLayer?.children?.map((child: any) => this.doCreate(child, layer, plainLayers)) ?? []))

    return layer
  }

  doCreateTemplate(plainLayer: PlainLayer, plainLayers?: PlainLayer[]) {
    const layer = this.doCreate(plainLayer, undefined, plainLayers)

    const compiledRawLayers = this.getTemplateCompiler().compile(layer)
    if (compiledRawLayers) {
      const layers = compiledRawLayers.map((compiledRawLayer) => this.createLayer(compiledRawLayer, plainLayers, { parentLayer: layer }))
      layer.children = new Layers(...layers)
    }

    // If has polygon children needs to recalculate the position
    if (layer.isCoordinatesBased()) {
      this.getDynamicDefaultsFiller().fillDefaultPosition(layer)

      // All children should have the same position encoding
      layer.getFlatChildren().forEach((child) => {
        child.encoding.position = layer.encoding.position
      })
    }

    return layer
  }

  createLayer(plainLayer: PlainLayer, plainLayers?: PlainLayer[], parent?: { parentId?: string, parentLayer?: Layer}): Layer {
    const layers = plainLayers ?? this.layers as any

    if (parent?.parentId || parent?.parentLayer) {
      const parentLayer = parent.parentId ? layers?.getById(parent.parentId, false) : parent.parentLayer
      return this.doCreate({...plainLayer}, parentLayer, layers)
    } else if (plainLayer.type === LayerType.template) {
      return this.doCreateTemplate({...plainLayer}, layers)
    }

    return this.doCreate({...plainLayer}, undefined, layers)
  }

  createLayers(plainLayers: any): Layers {
    const processedLayers = plainLayers.map((plainLayer) => this.createLayer({...plainLayer}, plainLayers)) as Layer[]
    return new Layers(...processedLayers)
  }

  duplicate(layer: Layer): Layer {
    const cloned = layer.clone()

    if (cloned.hasChildren()) {
      cloned.children = new Layers(...cloned.children!.map((child) => child.clone()))
    }

    return cloned
  }
}
