import {Coordinates} from './Coordinates'

test('Assumes 0 as default', () => {
  const coordinates = new Coordinates({})
  expect(coordinates.x).toStrictEqual(0)
  expect(coordinates.y).toStrictEqual(0)
})
