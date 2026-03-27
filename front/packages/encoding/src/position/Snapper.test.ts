import { Coordinates } from '@hopara/spatial'
import { Snapper } from './Snapper'

test('Snap', () => {
  const coordinatesList = [
    new Coordinates({x: 10, y: 8}),
    new Coordinates({x: 20, y: 20}),
  ]

  const snapper = new Snapper(2)
  const snappedCoordinates1 = snapper.snap(new Coordinates({x: 11, y: 11}), coordinatesList)!.coordinates
  expect(snappedCoordinates1.x).toBe(10)
  expect(snappedCoordinates1.y).toBe(11)

  const snappedCoordinates2 = snapper.snap(new Coordinates({x: 11, y: 9}), coordinatesList)!.coordinates
  expect(snappedCoordinates2.x).toBe(10)
  expect(snappedCoordinates2.y).toBe(8)
})

test('Snap with the closest', () => {
  const coordinatesList = [
    new Coordinates({x: 8, y: 8}),
    new Coordinates({x: 10, y: 10}),
  ]

  const snapper = new Snapper(5)
  const snappedCoordinates = snapper.snap(new Coordinates({x: 11, y: 11}), coordinatesList)!.coordinates
  expect(snappedCoordinates.x).toBe(10)
  expect(snappedCoordinates.y).toBe(10)
})
