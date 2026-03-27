import { getPolygonBearing } from './Polygon'

test('get bearing of polygon', () => {
  const polyBearing0 = [
    [0, 0],
    [0, 0.02],
    [0.02, 0.02],
    [0.02, 0],
    [-0, 0],
  ]

  const polyBearing25 = [
    [-0.003289260562041818, 0.005163104725581715],
    [0.005163104854204903, 0.02328926033758579],
    [0.02328926048176072, 0.01483689540314722],
    [0.014836895226039815, -0.003289260466314719],
    [-0.003289260562041818, 0.005163104725581715],
  ]

  expect(getPolygonBearing(polyBearing0)).toStrictEqual(0)
  expect(getPolygonBearing(polyBearing25)).toStrictEqual(24.99999903243447)
})
