import { drawLineFromCentroid } from './LineTransform'

test('should draw polygon from a given centroid', () => {
  const bounds = drawLineFromCentroid([10, 10], 100)
  expect(bounds).toEqual([[-40, 10], [60, 10]])
})
