import { drawSquareGeometryFromCentroid } from './DrawGeometry'

test('should draw polygon from a given centroid', () => {
  const bounds = drawSquareGeometryFromCentroid([10, 10], 100)
  expect(bounds).toEqual([
    [-40, 60], [-40, -40], [60, -40], [60, 60], [-40, 60],
  ])
})
