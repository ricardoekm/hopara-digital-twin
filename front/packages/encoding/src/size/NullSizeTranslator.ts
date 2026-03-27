import { SizeTranslator } from './SizeTranslator'

export class NullSizeTranslator implements SizeTranslator {
  getTargetZoom(referenceZoom?: number) {
    return referenceZoom
  }

  getPixelSize(value: number) {
    return value
  }

  getRenderSize(value: number) {
    return value
  }
}
