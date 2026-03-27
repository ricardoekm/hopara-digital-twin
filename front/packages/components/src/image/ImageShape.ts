import { OrthographicViewport } from '../view/deck/OrthographicViewport'
import WebMercatorViewport from '../view/deck/WebMercatorViewport'
import OrbitViewport from '../view/deck/OrbitViewport'
import { Bounds } from '@hopara/spatial'

// BBox = [minX, minY, maxX, maxY
export const getInnerBoundsPercentages = (
  rowGeometry: [number, number][],
  innerGeometry: [number, number][],
  imageRatio: number | undefined,
  viewport: OrthographicViewport | WebMercatorViewport,
) => {
  let rowBounds = Bounds.fromGeometry(rowGeometry, { orthographic: viewport instanceof OrthographicViewport })
  if (imageRatio) rowBounds = rowBounds.scaleToRatio(imageRatio)

  const unprojectedShape = rowBounds.unprojectGeometry(innerGeometry)
  // screen coordinates, so the Y axis is inverted
  const [minX, maxY, maxX, minY] = Bounds.fromGeometry(unprojectedShape, { orthographic: true, flipY: true }).toBBox()

  const leftPercent = minX
  const rightPercent = 100 - maxX
  const topPercent = maxY
  const bottomPercent = 100 - minY

  return {
    left: leftPercent < 0 ? 0 : leftPercent,
    top: topPercent < 0 ? 0 : topPercent,
    right: rightPercent < 0 ? 0 : rightPercent,
    bottom: bottomPercent < 0 ? 0 : bottomPercent,
  }
}

export const getInnerShape = (
  rowGeomtry: [number, number][],
  fitGeometry: number[][],
  targetRatio?: number,
  viewport?: OrthographicViewport | WebMercatorViewport | OrbitViewport,
) => {
  let rowBounds = Bounds.fromGeometry(rowGeomtry, { orthographic: viewport instanceof OrthographicViewport})
  if (targetRatio) rowBounds = rowBounds.scaleToRatio(targetRatio)

  return rowBounds.projectGeometry(fitGeometry)
}

export const getInnerShapePercentages = (
  rowGeomtry: [number, number][],
  geometry: number[][],
  viewport: OrthographicViewport | WebMercatorViewport,
) => {
  const rowBounds = Bounds.fromGeometry(rowGeomtry, { orthographic: viewport instanceof OrthographicViewport})
  const unprojectedShape = rowBounds.unprojectGeometry(geometry)

  return unprojectedShape.map(([x, y]) => [
    Math.min(Math.max(Number(x), 0), 100),
    Math.min(Math.max(Number(y), 0), 100),
  ])
}
