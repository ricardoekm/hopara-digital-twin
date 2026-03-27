import { OrthographicBounds } from './OrthographicBounds'
import { WebMercatorBounds } from './WebMercatorBounds'
import { lineLength } from 'geometric'

export const getExtrudedBoundsGeometry = (bounds: WebMercatorBounds | OrthographicBounds, refWidth: number, refHeight: number) => {
  const boundsWidth = lineLength([bounds.getTopRight() as any, bounds.getTopLeft() as any])
  const ratio = refWidth / refHeight
  const resizedHeight = boundsWidth / ratio

  const minX = bounds.getCentroid()[0] - (boundsWidth / 2)
  const minY = bounds.getCentroid()[1] - (resizedHeight / 2)
  const maxX = bounds.getCentroid()[0] + (boundsWidth / 2)
  const maxY = bounds.getCentroid()[1] + (resizedHeight / 2)

  return [[minX, minY], [minX, maxY], [maxX, maxY], [maxX, minY], [minX, minY]]
}

export const getExtrudedBoundsGeometryKeepingLargeSide = (bounds: WebMercatorBounds | OrthographicBounds, refWidth: number, refHeight: number) => {
  const boundsWidth = lineLength([bounds.getTopRight() as any, bounds.getTopLeft() as any])
  const boundsHeight = lineLength([bounds.getTopLeft() as any, bounds.getBottomLeft() as any])
  const ratio = refWidth / refHeight
  const centroid = bounds.getCentroid()

  let resizedWidth = boundsWidth
  let resizedHeight = boundsHeight

  if (ratio > 0 && Number.isFinite(ratio)) {
    const resizedHeightByWidth = boundsWidth / ratio

    if (resizedHeightByWidth <= boundsHeight) {
      resizedHeight = resizedHeightByWidth
    } else {
      resizedWidth = boundsHeight * ratio
    }
  }

  const minX = centroid[0] - (resizedWidth / 2)
  const minY = centroid[1] - (resizedHeight / 2)
  const maxX = centroid[0] + (resizedWidth / 2)
  const maxY = centroid[1] + (resizedHeight / 2)

  return [[minX, minY], [minX, maxY], [maxX, maxY], [maxX, minY], [minX, minY]]
}
