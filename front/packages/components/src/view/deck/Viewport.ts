import { Box, Dimensions } from '@hopara/spatial'

export const getVisibleWorld = (viewport: any): Box => {
  const bounds = viewport.getBounds()
  return Box.fromBounds(bounds)
}

export const getVisibleWorldDimensions = (viewport: any): Dimensions => {
  const bounds = viewport.getBounds()
  const width = Math.abs(bounds[2] - bounds[0])
  const height = Math.abs(bounds[3] - bounds[1])
  return {width, height}
}

const projectScale = (viewport: any, targetZoom?: number, scale = true): number => {
 return Math.pow(2, targetZoom ?? viewport.zoom) / (scale && viewport.scaleFactor ? viewport.scaleFactor : 1)
}

export const getSizePixels = (viewport: any, value = 1, unit = 'pixels', targetZoom?: number, scale?: boolean): number => {
  switch (unit) {
    case 'pixels':
      return value
    case 'meters':
      return value * viewport.getDistanceScales().unitsPerMeter[2] * projectScale(viewport, targetZoom, scale)
    default:
      return value * projectScale(viewport, targetZoom, scale)
  }
}

export const getSizeCommons = (viewport: any, value = 1, unit = 'pixels', targetZoom?: number, scale?: boolean): number => {
  switch (unit) {
    case 'pixels':
      return value / projectScale(viewport, targetZoom, scale)
    case 'meters':
      return value * viewport.getDistanceScales().unitsPerMeter[2]
    default:
      return value
  }
}
