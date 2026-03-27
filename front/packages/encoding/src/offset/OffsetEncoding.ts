import { Exclude } from 'class-transformer'
import { BaseEncoding } from '../BaseEncoding'
import { Type } from 'class-transformer'
import { SizeTranslator } from '../size/SizeTranslator'
import { Anchor } from '@hopara/spatial'

export class OffsetAxisEncoding {
  value?: number
  field?: string
  referenceZoom?: number

  @Exclude()
  sizeTranslator: SizeTranslator

  getRenderValue() {
    return this.sizeTranslator?.getRenderSize(this.value ?? 0, this.referenceZoom) ?? 0
  }

  getPixelValue(currentZoom?: number) : number {
    return this.sizeTranslator?.getPixelSize(this.value!, this.referenceZoom, currentZoom) ?? 0
  }

  constructor(props?: Partial<OffsetAxisEncoding>) {
    Object.assign(this, props)
  }
}

export class OffsetEncoding extends BaseEncoding<OffsetEncoding> {
  @Type(() => OffsetAxisEncoding)
  x?: OffsetAxisEncoding

  @Type(() => OffsetAxisEncoding)
  y?: OffsetAxisEncoding

  anchor?: Anchor

  constructor(props?: Partial<OffsetEncoding>) {
    super()
    Object.assign(this, props)
  }

  clone() {
    return new OffsetEncoding(this)
  }

  isRenderable(): boolean {
    return !!this.x || !!this.y
  }
}
