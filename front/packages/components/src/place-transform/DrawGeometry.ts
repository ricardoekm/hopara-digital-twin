import { Dimensions } from '@hopara/spatial'

const drawCCWBox = (bbox: number[]): [number, number][] => {
  return [
    [bbox[0], bbox[3]], // [left, top]
    [bbox[0], bbox[1]], // [left, bottom]
    [bbox[2], bbox[1]], // [right, bottom]
    [bbox[2], bbox[3]], // [right, top]
    [bbox[0], bbox[3]], // [left, top]
  ]
}

export const drawSquareGeometryFromCentroid = (centroid:[number, number], size: number, ratio = 1): [number, number][] => {
  const widthDelta = size / 2
  const heightDelta = (size * ratio) / 2
  const bbox = [
    centroid[0] - widthDelta,
    centroid[1] - heightDelta,
    centroid[0] + widthDelta,
    centroid[1] + heightDelta,
  ]
  return drawCCWBox(bbox)
}

export const drawGeometryFromDimensions = (centroid: [number, number], dimensions: Dimensions, padding = 15, ratio = 1): [number, number][] => {
  const paddingDelta = (padding / 100) * 2
  const minSize = Math.min(dimensions.width, dimensions.height)
  const minSizeWithPadding = minSize - (minSize * paddingDelta)
  const widthDelta = minSizeWithPadding / 2
  const heightDelta = (minSizeWithPadding * ratio) / 2

  if (widthDelta < 0 || heightDelta < 0) return drawSquareGeometryFromCentroid(centroid, 100, ratio)

  const bbox = [
    centroid[0] - widthDelta,
    centroid[1] - heightDelta,
    centroid[0] + widthDelta,
    centroid[1] + heightDelta,
  ]
  return drawCCWBox(bbox)
}

export const drawTargetGeometry = (centroid: [number, number], ratio = 1) => {  
  return drawSquareGeometryFromCentroid(centroid, 100, ratio)
}
