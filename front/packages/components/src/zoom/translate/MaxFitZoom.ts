import { ZoomRange } from '../ZoomRange'
import { Layer } from '../../layer/Layer'

function isPoint(geometry:number[][]) {
  return geometry.length > 1
}

export const getMaxFitZoom = (layer:Layer, targetGeometry: number[][], viewZoomRange:ZoomRange, isZoomJump? :boolean) => {
  const layerZoomRange = layer.visible.zoomRange  
  if (isZoomJump) {
    if (isPoint(targetGeometry)) {
      return viewZoomRange.getMaxVisible()
    }

    return Math.min(viewZoomRange.getMaxVisible(), 
                    layerZoomRange.getMaxVisible(), 
                    layer.encoding?.config?.maxResizeZoom ?? Number.MAX_SAFE_INTEGER)
  }

  if (!layer.isCoordinatesBased()) {
    return layer.getGoToZoom()
  }

  return layerZoomRange.getMaxVisible()
}
