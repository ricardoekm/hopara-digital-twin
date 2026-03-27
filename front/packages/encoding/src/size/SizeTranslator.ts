export interface SizeTranslator {
  getPixelSize(value: number, referenceZoom: number | undefined, currentZoom: number | undefined)
  getRenderSize(value: number, referenceZoom: number | undefined)
}
