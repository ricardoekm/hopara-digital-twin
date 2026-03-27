import { SizeUnits, SizeTranslator as SizeTranslatorInterface } from '@hopara/encoding'
import ViewState from '../../view-state/ViewState'

export class SizeTranslator implements SizeTranslatorInterface {
  viewState: ViewState
  scale: boolean
  sizeUnits: SizeUnits
  maxResizeZoom?: number

  constructor(viewState: ViewState, scale: boolean, sizeUnits?: SizeUnits, maxResizeZoom?: number) {
    this.viewState = viewState
    this.scale = scale
    this.sizeUnits = sizeUnits || SizeUnits.PIXELS
    this.maxResizeZoom = maxResizeZoom
  }

  private getTargetZoom(referenceZoom: number) {
    return this.maxResizeZoom && this.maxResizeZoom < referenceZoom ? this.maxResizeZoom : referenceZoom
  }
  
  // We always save in pixels + reference zoom, here we translate to deck values (if resize true to commons)
  getRenderSize(value: number, referenceZoom: number | undefined) {
    if (this.sizeUnits === SizeUnits.PIXELS) {
      return value
    }
    
    const targetZoom = this.getTargetZoom(referenceZoom!)
    return this.viewState.projectPixelToCommons(value, targetZoom, this.scale)
  }
  
  getPixelSize(value: number, referenceZoom: number | undefined, currentZoom?: number | undefined) {
    if (this.sizeUnits === SizeUnits.PIXELS) {
      return value
    }
  
    const targetCurrentZoom = this.getTargetZoom(currentZoom!)
    const targetReferenceZoom = this.getTargetZoom(referenceZoom!)
    const commonsValue = this.viewState.projectPixelToCommons(value, targetReferenceZoom, this.scale)
    return this.viewState.projectCommonsToPixel(commonsValue, targetCurrentZoom, this.scale)
  }

  clone() {
    return new SizeTranslator(this.viewState, this.scale, this.sizeUnits, this.maxResizeZoom)
  }
}
