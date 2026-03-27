 

import {SizeEncoding, SizeUnits} from './size/SizeEncoding'
import {ColorEncoding} from './color/ColorEncoding'
import {IconEncoding} from './icon/IconEncoding'
import {TextEncoding} from './text/TextEncoding'
import {PositionEncoding} from './position/PositionEncoding'
import {AnimationEncoding} from './animation/AnimationEncoding'
import {ImageEncoding} from './image/ImageEncoding'
import {PolygonEncoding} from './polygon/PolygonEncoding'
import {LineEncoding} from './line/LineEncoding'
import {OffsetEncoding} from './offset/OffsetEncoding'

import {ModelEncoding} from './model/ModelEncoding'
import {RotationEncoding} from './rotation/RotationEncoding'
import {ArcEncoding} from './arc/ArcEncoding'
import { Type } from 'class-transformer'
import {ShadowEncoding} from './shadow/ShadowEncoding'
import { MapEncoding } from './map/MapEncoding'
import { EncodingConfig } from './config/EncodingConfig'

function mergeSizeEncoding(size?:SizeEncoding, parentSize?:SizeEncoding) {
  if (parentSize?.multiplier !== undefined && size) {
    return new SizeEncoding({
      ...size,
      multiplier: parentSize?.multiplier ?? 1,            
    })
  }

  return size
}

export class Encodings {
  @Type(() => ColorEncoding)
  color?: ColorEncoding
  
  @Type(() => ColorEncoding)
  strokeColor?: ColorEncoding

  @Type(() => SizeEncoding)
  strokeSize?: SizeEncoding

  @Type(() => SizeEncoding)
  borderRadius?: SizeEncoding

  @Type(() => SizeEncoding)
  size?: SizeEncoding

  @Type(() => IconEncoding)
  icon?: IconEncoding

  @Type(() => MapEncoding)
  map?: MapEncoding

  @Type(() => TextEncoding)
  text?: TextEncoding

  @Type(() => PositionEncoding)
  position?: PositionEncoding

  @Type(() => AnimationEncoding)
  animation?: AnimationEncoding

  @Type(() => LineEncoding)
  line?: LineEncoding

  @Type(() => PolygonEncoding)
  polygon?: PolygonEncoding

  @Type(() => ImageEncoding)
  image?: ImageEncoding

  @Type(() => OffsetEncoding)
  offset?: OffsetEncoding

  @Type(() => ModelEncoding)
  model?: ModelEncoding

  @Type(() => RotationEncoding)
  rotation?: RotationEncoding

  @Type(() => ArcEncoding)
  arc?: ArcEncoding

  @Type(() => ShadowEncoding)
  shadow?: ShadowEncoding

  @Type(() => EncodingConfig)
  config?: EncodingConfig

  @Type(() => SizeEncoding)
  angle?: SizeEncoding

  constructor(encodings: Partial<Encodings>) {
    if (!encodings) return

    Object.assign(this, encodings)
  }

  getColor(): ColorEncoding | undefined {
    if (this.color instanceof ColorEncoding) return this.color
  }

  getUnits(): SizeUnits {
    return this.config?.units ?? SizeUnits.PIXELS
  }

  mergeWith(encodings?: Encodings) {
    if (!encodings) {
      // For root layers (no parent encoding), still propagate offset.anchor to position.anchor
      // so the rendering factories pick up the anchor set via the OffsetEditor.
      if (this.offset?.anchor && this.position) {
        const mergedPosition = new PositionEncoding({...this.position, anchor: this.offset.anchor})
        mergedPosition.resetUpdatedTimestamp()
        return new Encodings({...this, position: mergedPosition})
      }
      return this
    }

    let mergedPosition = encodings.position
    if (encodings.position && this.offset?.anchor) {
      mergedPosition = new PositionEncoding({...encodings.position, anchor: this.offset.anchor})
      mergedPosition.resetUpdatedTimestamp()
    }

    return new Encodings({
      ...this,
      position: mergedPosition,
      size: mergeSizeEncoding(this.size, encodings.size),
      strokeSize: mergeSizeEncoding(this.strokeSize, encodings.size),
      config: encodings.config,
    })
  }

  resetUpdatedTimestamp() {
    this.size?.resetUpdatedTimestamp()
    this.color?.resetUpdatedTimestamp()
    this.icon?.resetUpdatedTimestamp()
    this.text?.resetUpdatedTimestamp()
    this.position?.resetUpdatedTimestamp()
    this.animation?.resetUpdatedTimestamp()
    this.image?.resetUpdatedTimestamp()
    this.polygon?.resetUpdatedTimestamp()
    this.line?.resetUpdatedTimestamp()
    this.model?.resetUpdatedTimestamp()
    this.rotation?.resetUpdatedTimestamp()
    this.arc?.resetUpdatedTimestamp()
    this.shadow?.resetUpdatedTimestamp()
    this.map?.resetUpdatedTimestamp()
    this.offset?.resetUpdatedTimestamp()
  }
}
