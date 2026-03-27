import { getSizeCommons, getSizePixels } from './Viewport'
import WebMercatorViewport from './WebMercatorViewport'


describe('project size', () => {
  it('should project size to pixels', () => {
    const viewport = new WebMercatorViewport({width: 100, height: 100})
    expect(getSizePixels(viewport, 10, 'pixels')).toBe(10)
    expect(getSizePixels(viewport, 10, 'meters')).toBe(0.00012790407194604046)
    expect(getSizePixels(viewport, 10, 'commons')).toBe(10)
  })

  it('should project size to pixels with zoomed viewport', () => {
    const viewport = new WebMercatorViewport({width: 100, height: 100, zoom: 10})
    expect(getSizePixels(viewport, 10, 'pixels')).toBe(10)
    expect(getSizePixels(viewport, 10, 'meters')).toBe(0.13097376967274543)
    expect(getSizePixels(viewport, 10, 'commons')).toBe(10240)
  })

  it('should project size to common', () => {
    const viewport = new WebMercatorViewport({width: 100, height: 100})
    expect(getSizeCommons(viewport, 10, 'pixels')).toBe(10)
    expect(getSizeCommons(viewport, 10, 'meters')).toBe(0.00012790407194604046)
    expect(getSizeCommons(viewport, 10, 'commons')).toBe(10)
  })

  it('should project size to common with zoomed viewport', () => {
    const viewport = new WebMercatorViewport({width: 100, height: 100, zoom: 10})
    expect(getSizeCommons(viewport, 10, 'pixels')).toBe(0.009765625)
    expect(getSizeCommons(viewport, 10, 'meters')).toBe(0.00012790407194604046)
    expect(getSizeCommons(viewport, 10, 'commons')).toBe(10)
  })

  it('should project size to common with scaleFactor', () => {
    const viewport = new WebMercatorViewport({width: 100, height: 100})
    expect(getSizeCommons(viewport, 10, 'pixels', 1.5)).toBe(3.5355339059327378)
    expect(getSizeCommons(viewport, 10, 'commons', 1.5)).toBe(10)
  })
})
