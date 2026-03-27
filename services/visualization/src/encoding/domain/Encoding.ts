import {ColorEncodingImpl} from './impl/ColorEncodingImpl.js'
import {PolygonEncodingImpl} from './impl/PolygonEncodingImpl.js'
import {PositionEncodingImpl} from './impl/PositionEncodingImpl.js'
import {SizeEncodingImpl} from './impl/SizeEncodingImpl.js'
import {IconEncodingImpl} from './impl/IconEncodingImpl.js'
import {OffsetEncodingImpl} from './impl/OffsetEncodingImpl.js'
import {ImageEncoding} from './spec/ImageEncoding.js'
import {LineEncoding} from './spec/LineEncoding.js'
import {TextEncoding} from './spec/TextEncoding.js'
import { ModelEncoding } from './spec/ModelEncoding.js'
import { RotationEncoding } from './spec/RotationEncoding.js'
import {StrokeSizeEncoding} from './spec/SizeEncoding.js'
import {ShadowEncoding} from './spec/ShadowEncoding.js'
import { ConfigEncoding } from './spec/ConfigEncoding.js'

export enum EncodingName {
  COLOR = 'color',
  ICON = 'icon',
  IMAGE = 'image',
  LINE = 'line',
  MODEL = 'model',
  OFFSET = 'offset',
  POLYGON = 'polygon',
  POSITION = 'position',
  ROTATION = 'rotation',
  SIZE = 'size',
  STROKE_COLOR = 'strokeColor',
  STROKE_SIZE = 'strokeSize',
  BORDER_RADIUS = 'borderRadius',
  TABLE = 'table',
  TEXT = 'text',
  SHADOW = 'shadow',
  MAP = 'map'
}

export interface Encoding {
  [EncodingName.COLOR]?: ColorEncodingImpl
  [EncodingName.ICON]?: IconEncodingImpl
  [EncodingName.IMAGE]?: ImageEncoding
  [EncodingName.LINE]?: LineEncoding
  [EncodingName.MODEL]?: ModelEncoding
  [EncodingName.OFFSET]?: OffsetEncodingImpl
  [EncodingName.POLYGON]?: PolygonEncodingImpl
  [EncodingName.POSITION]?: PositionEncodingImpl
  [EncodingName.ROTATION]?: RotationEncoding
  [EncodingName.SIZE]?: SizeEncodingImpl
  [EncodingName.STROKE_COLOR]?: ColorEncodingImpl
  [EncodingName.STROKE_SIZE]?: StrokeSizeEncoding
  [EncodingName.TEXT]?: TextEncoding
  [EncodingName.SHADOW]?: ShadowEncoding
  config?: ConfigEncoding
}
