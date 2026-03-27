import {Data} from '../../../data/domain/spec/Data.js'
import {Actions} from './Action.js'
import {Details} from './Details.js'
import {Visible} from './Visible.js'
import {LayerType} from './LayerType.js'
import {ArcLayerEncoding} from './encoding/ArcLayerEncoding.js'
import {AreaLayerEncoding} from './encoding/AreaLayerEncoding.js'
import {CircleLayerEncoding} from './encoding/CircleLayerEncoding.js'
import {IconLayerEncoding} from './encoding/IconLayerEncoding.js'
import {TextLayerEncoding} from './encoding/TextLayerEncoding.js'
import {BarLayerEncoding} from './encoding/BarLayerEncoding.js'
import {ImageLayerEncoding} from './encoding/ImageLayerEncoding.js'
import {LineLayerEncoding} from './encoding/LineLayerEncoding.js'
import {ModelLayerEncoding} from './encoding/ModelLayerEncoding.js'
import {PolygonLayerEncoding} from './encoding/PolygonLayerEncoding.js'
import {CompositeLayerEncoding} from './encoding/CompositeLayerEncoding.js'
import {RectangleLayerEncoding} from './encoding/RectangleLayerEncoding.js'
import {MapLayerEncoding} from './encoding/MapLayerEncoding.js'
import {TemplateLayerEncoding} from './encoding/TemplateLayerEncoding.js'

enum RefreshBehavior {
  NONE = 'NONE',
  SELF = 'SELF',
  OTHERS = 'OTHERS',
  ALL = 'ALL'
}

// WARNING! this interface cannot be exported to keep the schema valid
interface BaseLayer<TEncoding, TType extends LayerType> {
  id?: string
  name?: string
  encoding?: TEncoding
  type: TType
  refreshBehavior?: RefreshBehavior
}

// WARNING! this interface cannot be exported to keep the schema valid
interface Highlightable {
  highlight?: boolean
}

// WARNING! this interface cannot be exported to keep the schema valid
interface HighOrderLayer<TEncoding, TType extends LayerType> extends BaseLayer<TEncoding, TType> {
  data?: Data
  details?: Details
  locked?: boolean
  actions?: Actions
  visible?: Visible
  icon?: string
  helperText?: string
  scale?: boolean
}

type StandardLayer<TEncoding, TType extends LayerType> = HighOrderLayer<TEncoding, TType> & Highlightable

export type ArcLayer = StandardLayer<ArcLayerEncoding, LayerType.arc>
export type AreaLayer = StandardLayer<AreaLayerEncoding, LayerType.area>
export type BarLayer = StandardLayer<BarLayerEncoding, LayerType.bar>
export type RectangleLayer = StandardLayer<RectangleLayerEncoding, LayerType.rectangle>
export type CircleLayer = StandardLayer<CircleLayerEncoding, LayerType.circle>
export type IconLayer = StandardLayer<IconLayerEncoding, LayerType.icon>
export type ImageLayer = StandardLayer<ImageLayerEncoding, LayerType.image>
export type LineLayer = StandardLayer<LineLayerEncoding, LayerType.line>
export type ModelLayer = StandardLayer<ModelLayerEncoding, LayerType.model>
export type PolygonLayer = StandardLayer<PolygonLayerEncoding, LayerType.polygon>
export type TextLayer = StandardLayer<TextLayerEncoding, LayerType.text>

type ComposableLayer<TEncoding, TType extends LayerType> =
  BaseLayer<TEncoding, TType> & Highlightable & {
  type: TType
  encoding?: TEncoding
  visible?: Omit<Visible, 'zoomRange' | 'value'>
}

export type MapLayer = BaseLayer<MapLayerEncoding, LayerType.map> & {
  visible?: Omit<Visible, 'condition'>
}

type ComposableOmittedAttributes = 'position' | 'config' | 'details' | 'actions'

export type ComposableCircleLayerEncoding = Omit<CircleLayerEncoding, ComposableOmittedAttributes>
export type ComposableIconLayerEncoding = Omit<IconLayerEncoding, ComposableOmittedAttributes>
export type ComposableTextLayerEncoding = Omit<TextLayerEncoding, ComposableOmittedAttributes>

export type ComposableCircleLayer = ComposableLayer<ComposableCircleLayerEncoding, LayerType.circle>
export type ComposableIconLayer = ComposableLayer<ComposableIconLayerEncoding, LayerType.icon>
export type ComposableTextLayer = ComposableLayer<ComposableTextLayerEncoding, LayerType.text>

export type ComposableLayerSpec = (
  ComposableCircleLayer |
  ComposableIconLayer |
  ComposableTextLayer)

export type CompositeLayer = HighOrderLayer<TemplateLayerEncoding, LayerType.composite> & {
  children: ComposableLayerSpec[]
  visible?: Omit<Visible, 'condition'>
}

export type TemplateLayer = HighOrderLayer<CompositeLayerEncoding, LayerType.template> & {
  visible?: Omit<Visible, 'condition'>
  template?: Record<string, any>
}

export type LayerSpec = (
  CompositeLayer |
  CircleLayer |
  IconLayer |
  TextLayer |
  ModelLayer |
  AreaLayer |
  ImageLayer |
  LineLayer |
  PolygonLayer |
  ArcLayer |
  BarLayer |
  RectangleLayer |
  MapLayer |
  TemplateLayer)

export type Layers = LayerSpec[]
