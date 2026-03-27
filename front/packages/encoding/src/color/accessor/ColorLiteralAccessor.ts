import {Accessor} from './ColorAccessor'
import {rgbColor, RgbaColor, toRGBArray} from '../Colors'
import {ColorEncoding} from '../ColorEncoding'
import {i18n} from '@hopara/i18n'

export class ColorLiteralAccessor implements Accessor {
  colorEncoding?: ColorEncoding

  constructor(colorEncoding?: ColorEncoding) {
    this.colorEncoding = colorEncoding
  }

  private getRawColor() {
    if (!this.colorEncoding) {
      throw new Error(i18n('COLOR_ENCODING_IS_NOT_DEFINED'))
    }
    if (this.colorEncoding.value) {
      return rgbColor(this.colorEncoding.value)
    }
    
    return
  }

   
  getColor(): RgbaColor | undefined {
    const color = this.getRawColor()
    if (!color) return
    return toRGBArray(color.copy({opacity: this.colorEncoding?.opacity ?? 1}))
  }
}
