import {
  ColorScaleType,
  IconEncoding,
  ImageEncoding,
  MaxLengthType,
  ModelEncoding,
  NullSizeTranslator,
  PolygonEncoding,
  PositionEncoding,
  SizeUnits,
  TextEncoding,
  VIEW_MANAGED_FIELD,
  ViewEncoding
} from '@hopara/encoding'
import { Layer, PlainLayer } from '../Layer'
import { isEmpty, isNil, isUndefined } from 'lodash/fp'
import { LayerType } from '../LayerType'
import { capital } from 'case'
import { Columns, ColumnType, Queries } from '@hopara/dataset'
import { Details } from '../../details/Details'
import { DetailsFields } from '../../details/DetailsFields'
import { ZoomRange } from '../../zoom/ZoomRange'
import { QueryKey } from '@hopara/dataset/src/query/Queries'
import { DataRef, isDataRef } from '@hopara/encoding/src/data/DataRef'
import { ActionType, Trigger } from '../../action/Action'
import { DEFAULT_PADDING } from '../../zoom/translate/BoundsPadding'
import { LayerTemplate } from '../template/domain/LayerTemplate'
import { VisualizationType } from '../../visualization/Visualization'
import { autoFillPosition } from '../editor/position/PositionAutoFill'
import { PositionType } from '@hopara/encoding/src/position/PositionEncoding'
import { plainToInstance } from 'class-transformer'
import ViewState from '../../view-state/ViewState'
import { EncodingConfig } from '@hopara/encoding/src/config/EncodingConfig'
import { SizeTranslator } from './SizeTranslator'
import { Layers } from '../Layers'
import { VIEW_DEFAULT_VALUE } from '@hopara/encoding/src/image/ViewEncoding'

export class DynamicDefaultsFiller {
  readonly queries?: Queries
  readonly zoomRange?: ZoomRange
  readonly scope?: string
  readonly visualizationType?: VisualizationType
  readonly templates?: LayerTemplate[]
  readonly viewState?: ViewState
  visualizationCreatedVersion?: string

  constructor(props: Partial<DynamicDefaultsFiller>) {
    Object.assign(this, props)

    this.templates = props.templates ?? []
  }

  fillTextDefaults(layer: Layer, layers?: PlainLayer[]) {
    if (!layer.getQueryKey() || layer.type !== LayerType.text) {
      return
    }

    if (layer.encoding?.text?.field || !isNil(layer.encoding?.text?.value)) {
      return
    }

    const query = this.queries?.findQuery(layer.getData().getQueryKey())
    const textColumn = query?.getColumns().find((column) => column.isCategorical())
    if (textColumn) {
      layer.encoding.text = new TextEncoding({
        ...layer.encoding.text,
        field: textColumn.getName()
      })
    }

    if (layers && !layer.encoding.text?.maxLength && layer.encoding.position?.type === PositionType.REF) {
      const refLayer = layers.find((l) => l.id === (layer.encoding.position?.data as DataRef).layerId!)
      if (refLayer) {
        if (refLayer.type === LayerType.polygon || refLayer.type === LayerType.image) {
          layer.encoding.text = new TextEncoding({
            ...layer.encoding.text,
            maxLength: {
              type: MaxLengthType.AUTO
            }
          })
        }
      }
    }
  }

  getDefaultImageScope(queryKey: QueryKey) {
    const imageScope = `${queryKey.query}-${queryKey.source}`
    if (this.scope) {
      return imageScope + '-' + this.scope
    }

    return imageScope
  }

  getDefaultModelScope(queryKey: QueryKey) {
    const modelScope = `${queryKey.query}-${queryKey.source}`
    if (this.scope) {
      return modelScope + '-' + this.scope
    }
    return modelScope
  }

  private fillImageDefaults(layer: Layer) {
    if (!layer.getQueryKey() || layer.type !== LayerType.image) {
      return
    }

    if (!layer.encoding?.image?.scope) {
      layer.encoding.image = new ImageEncoding({
        ...layer.encoding.image,
        scope: this.getDefaultImageScope(layer.getQueryKey())
      })
    }

    if (!layer.encoding.image.field && isNil(layer.encoding.image?.value)) {
      const query = this.queries?.findQuery(layer.getData().getQueryKey())
      if (query && query.hasPrimaryKey()) {
        layer.encoding.image = new ImageEncoding({
          ...layer.encoding.image,
          field: query.getPrimaryKey()!.getName()
        })
      }
    }

    if ( layer.isManagedPositionEncoding() && !layer.encoding.image.view ) {
      if ( this.visualizationType === VisualizationType.WHITEBOARD || this.visualizationType === VisualizationType.ISOMETRIC_WHITEBOARD ) {
        layer.encoding.image.view = new ViewEncoding({ value: VIEW_DEFAULT_VALUE, field: VIEW_MANAGED_FIELD })
      }
    }
  }

  private fillModelDefaults(layer: Layer) {
    if (!layer.getQueryKey() || layer.type !== LayerType.model) {
      return
    }

    if (!layer.encoding?.model?.scope) {
      layer.encoding.model = new ModelEncoding({
        ...layer.encoding.model,
        scope: this.getDefaultModelScope(layer.getQueryKey())
      })
    }

    if (!layer.encoding.model?.field && isNil(layer.encoding.model?.value)) {
      const query = this.queries?.findQuery(layer.getData().getQueryKey())
      if (query && query.hasPrimaryKey()) {
        layer.encoding.model = new ModelEncoding({
          ...layer.encoding.model,
          field: query.getPrimaryKey()!.getName()
        })
      }
    }
  }

  getColorColumn(layer: Layer) {
    const query = this.queries?.findQuery(layer.getData()?.getQueryKey())
    if (query) {
      return query.getColumns().get(layer.encoding?.color?.field)
    }

    return undefined
  }

  getDefaultScaleType(layer: Layer) {
    const column = this.getColorColumn(layer)
    if (column?.isQuantitative()) {
      return ColorScaleType.GROUPED
    } else {
      return ColorScaleType.SORTED
    }
  }

  private fillDefaultScaleType(layer: Layer) {
    if (!layer.encoding?.color?.field || !layer.hasData() || layer.encoding.color?.scale?.type) {
      return
    }

    layer.encoding.color.scale = {
      ...layer.encoding.color.scale,
      type: this.getDefaultScaleType(layer)
    }
  }

  fillDefaultColor(layer: Layer) {
    const query = this.queries?.findQuery(layer.getPositionQueryKey())
    if (!query || layer.encoding.color?.field === null || layer.encoding.color?.field) {
      return
    }

    // Image can only set opacity, which is not currently possible per object basis
    if (layer.canSetObjectAppearance() && !layer.isType(LayerType.image) && layer.encoding.color &&
      query.getColumns().has(layer.encoding.color.getManagedField())) {
      layer.encoding.color.field = layer.encoding.color.getManagedField()
    }
  }

  fillDefaultSize(layer: Layer) {
    const query = this.queries?.findQuery(layer.getPositionQueryKey())
    if (!query || layer.encoding.size?.field === null || layer.encoding.size?.field) {
      return
    }

    if (layer.canSetObjectAppearance() && layer.encoding.size &&
      query.getColumns().has(layer.encoding.size.getManagedField())) {
      layer.encoding.size.field = layer.encoding.size.getManagedField()
    }
  }

  fillDefaultName(layer: Layer, layers?: PlainLayer[]) {
    if (!isNil(layer.name) || !layers) {
      return
    }

    let targetLayers: any[] = layers

    if (layer.parentId) {
      targetLayers = layers.find((l) => l.id === layer.parentId)?.children ?? layers
    }

    const layerIndex = targetLayers.findIndex((l) => l.id === layer.getRawId())
    const layersBefore = layerIndex >= 0 ? targetLayers.slice(0, layerIndex) : targetLayers
    const layersWithSameType = layersBefore.filter((l: any) => {
      if (l.raw?.type && layer.raw?.type) {
        return l.raw.type === layer.raw.type && l.raw?.id !== layer.raw?.id // template layer needs to compare raw data
      }

      return l.type === layer.type && l.id !== layer.getRawId()
    })
    layer.name = capital(layer.type) + ' ' + (layersWithSameType.length + 1)
  }

  sortDetailsFields(columns: Columns, fields: DetailsFields) {
    if (isEmpty(fields) || !this.queries) {
      return
    }

    fields.swapTo(columns, 0, (c) => c.isType(ColumnType.STRING) && !c.primaryKey)
  }

  fillDefaultDetails(layer: Layer) {
    if (!this.queries) {
      return
    }

    const query = this.queries.findQuery(layer.getQueryKey())
    if (!query) {
      return
    }

    const columns = query.getColumns(layer.getTransformType())
    const fields = layer.details?.fields?.rightJoinColumns(columns) ?? new DetailsFields()

    if (isEmpty(layer.details?.fields)) {
      this.sortDetailsFields(columns, fields)
    }

    layer.details = new Details({
      ...layer.details,
      fields
    })
  }


  fillDefaultZoomRange(layer: Layer) {
    if (!this.zoomRange) {
      return
    }

    if (!layer.visible.zoomRange) {
      layer.visible.zoomRange = new ZoomRange()
    }

    if (!layer.visible.zoomRange.min) {
      layer.visible.zoomRange.min = { value: this.zoomRange.getMin() }
    }

    if (!layer.visible.zoomRange.max) {
      layer.visible.zoomRange.max = { value: this.zoomRange.getMax() }
    }
  }

  fillDefaultPositionScope(layer: Layer) {
    if (!this.scope) {
      return
    }

    const positionEncoding = layer.encoding?.position
    if (positionEncoding && !positionEncoding.scope) {
      if ( layer.data.isInternal()) {
        if ( this.visualizationCreatedVersion == '0.57' ) {
          positionEncoding.scope = layer.getId()
        } else {
          positionEncoding.scope = this.scope
        }
      } else {
        positionEncoding.scope = this.scope
      }
    }
  }

  findById(layers: PlainLayer[], id: string) {
    if ( layers instanceof Layers ) {
      return layers.flatLayers().find((plainLayer) => plainLayer.getId() === id)
    } else {
      return layers.find((plainLayer) => plainLayer.id === id)
    }
  }

  fillDefaultRefData(layer: Layer, layers?: PlainLayer[]) {
    if (!(layer.encoding?.position?.data instanceof DataRef) || !layers) return

    const targetLayerId = (layer.encoding.position!.data as DataRef).layerId!
    const plainRefLayer = this.findById(layers, targetLayerId)
    const refLayer = plainRefLayer ? plainToInstance(Layer, plainRefLayer) : undefined
    if (!refLayer) return
    this.fillDefaultPosition(refLayer)
    this.fillDefaultPositionScope(refLayer)

    layer.encoding.position.data = layer.encoding.position.data.mergeWith(refLayer.getPositionData())

    if (layer.isCoordinatesBased()) {
      layer.encoding.position.coordinates = refLayer.encoding!.position?.coordinates
    } else {
      layer.encoding.position.x = refLayer.encoding!.position!.x ?? refLayer.encoding!.position?.coordinates
      layer.encoding.position.y = refLayer.encoding!.position!.y ?? refLayer.encoding!.position?.coordinates
    }

    layer.encoding.position.scope = refLayer.encoding!.position?.scope
    layer.encoding.position.floor = refLayer.encoding!.position?.floor
  }

  private getPositionLayer(layer: Layer, layers: PlainLayer[]) {
    const positionData = layer.encoding?.position?.data
    if (isDataRef(positionData)) {
      const positionDataLayer = positionData.layerId
      return layers.find((l) => l.id === positionDataLayer)!
    }
    return layer
  }

  private fillDefaultActionPadding(layer: Layer, layers?: PlainLayer[]) {
    const LAYER_PADDING = {
      [LayerType.circle]: 45,
      [LayerType.icon]: 45,
      [LayerType.text]: 35,
      [LayerType.composite]: 40
    }

    const positionLayer = this.getPositionLayer(layer, layers ?? [])

    layer.actions?.forEach((action) => {
      if (action.type === ActionType.ZOOM_JUMP && isNil(action.zoom?.padding)) {
        action.zoom = {
          ...action.zoom,
          padding: LAYER_PADDING[positionLayer.type!] ?? DEFAULT_PADDING
        }
      }
    })
  }

  fillActionTrigger(layer: Layer) {
    layer.actions?.forEach((action) => {
      if (action.type === ActionType.ZOOM_JUMP && action.trigger === undefined) {
        action.trigger = Trigger.OBJECT_CLICK
      }
    })
  }

  private fillDefaultTemplate(layer: Layer) {
    if (!layer.isType(LayerType.template) || !this.templates?.length) {
      return
    }

    if (!layer.template) layer.template = {}
    if (!layer.template.id) layer.template.id = this.templates[0].id
  }

  fillDefaultPosition(layer: Layer) {
    if (!layer.encoding || layer.isType(LayerType.map)) {
      return
    }

    const positionQuery = this.queries?.findQuery(layer.getPositionData().getQueryKey())
    const dataQuery = this.queries?.findQuery(layer.getData().getQueryKey())

    const positionEncoding = layer.encoding.position ?? new PositionEncoding()
    layer.encoding.position = autoFillPosition(positionEncoding, layer, this.visualizationType as VisualizationType, positionQuery!, dataQuery!)
  }

  shouldScale(layer:Layer) {
    if ( !isUndefined(layer.scale) ) {
      return layer.scale
    }

    return false
  }

  getSizeTranslator(layer: Layer, configEncoding?: EncodingConfig) {
    return new SizeTranslator(this.viewState!, this.shouldScale(layer), 
                              configEncoding?.units, configEncoding?.maxResizeZoom)
  }

  doFillSizeTranslator(layer: Layer, configEncoding: EncodingConfig) {
    const encodingsToFill = ['size', 'strokeSize']
    const sizeTranslator = this.getSizeTranslator(layer, configEncoding)

    for (const encodingKey of encodingsToFill) {
      if (!layer.encoding[encodingKey]) continue

      const encoding = layer.encoding[encodingKey]
      if (layer.isType(LayerType.icon) && encodingKey === 'strokeSize') {
        encoding.sizeTranslator = new NullSizeTranslator()
      } else {
        encoding.sizeTranslator = sizeTranslator
      }
    }

    if (layer.encoding.offset) {
      const offsetSizeTranslator = sizeTranslator.clone()
      offsetSizeTranslator.scale = false // We can't change the offset based on the screen size
      const encoding = layer.encoding.offset
      if (encoding.x) {
        encoding.x!.sizeTranslator = offsetSizeTranslator
      }
      if (encoding.y) {
        encoding.y!.sizeTranslator = offsetSizeTranslator
      }
    }
  }

  fillSizeProjection(layer: Layer) {
    if (!this.viewState || !this.viewState.getViewport() || this.viewState.hasDefaultDimensions()) {
      return
    }

    const borderRadiusEncoding = layer.encoding.borderRadius
    if (borderRadiusEncoding) {
      // Border radius is always in commons
      const commonsConfig = new EncodingConfig({ ...layer.encoding.config, units: SizeUnits.COMMON })
      borderRadiusEncoding.sizeTranslator = this.getSizeTranslator(layer, commonsConfig)
    }

    layer.getRenderLayers()!.forEach((child) => {
      if (!child.encoding) return

      this.doFillSizeTranslator(child, layer.encoding.config!)
    })
  }

  fillPolygonContentType(layer:Layer) {
    if ( layer.isType(LayerType.polygon) ) {
      const positionColumnName = layer.encoding.position?.coordinates?.field
      const query = this.queries?.findQuery(layer.getData().getQueryKey())
      const positionColumn = query?.getColumns().get(positionColumnName)
      if ( positionColumn ) {
        if ( !layer.encoding.polygon ) {
          layer.encoding.polygon = new PolygonEncoding()
        }

        if ( positionColumn.isType(ColumnType.JSON) || positionColumn.isType(ColumnType.STRING) ) {
          layer.encoding.polygon.contentType = 'geo-json'
        } else {
          layer.encoding.polygon.contentType = 'geometry'
        }
      }
    }
  }

  fillDefaultIcon(layer: Layer) {
    if ( !layer.isType(LayerType.icon) || !layer.encoding ) {
      return
    }

    if ( !layer.encoding.icon ) {
      layer.encoding.icon = new IconEncoding()
    }

    if ( !layer.encoding.icon.value && !layer.encoding.icon.field ) {
      layer.encoding.icon.value = 'map-marker'
    }

    if ( layer.encoding.icon.field && isUndefined(layer.encoding.icon.smartSearch) ) {
      layer.encoding.icon.smartSearch = true
    }
  }

  fillDynamicDefaults(layer: Layer, layers?: PlainLayer[]) {
    this.fillDefaultPosition(layer)
    this.fillDefaultZoomRange(layer)
    this.fillDefaultDetails(layer)
    this.fillImageDefaults(layer)
    this.fillModelDefaults(layer)
    this.fillTextDefaults(layer, layers)
    this.fillDefaultName(layer, layers)
    this.fillDefaultColor(layer)
    this.fillDefaultSize(layer)
    this.fillDefaultScaleType(layer)
    this.fillDefaultPositionScope(layer)
    this.fillDefaultRefData(layer, layers)
    this.fillDefaultActionPadding(layer, layers)
    this.fillActionTrigger(layer)
    this.fillDefaultTemplate(layer)
    this.fillSizeProjection(layer)
    this.fillPolygonContentType(layer)
    this.fillDefaultIcon(layer)
  }
}
