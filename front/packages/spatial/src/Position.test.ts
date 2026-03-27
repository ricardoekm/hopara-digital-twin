import { Position } from './Position'

test('get position axis', () => {
  const position = new Position(0, 1)

  expect(position.getX()).toStrictEqual(0)
  expect(position.getY()).toStrictEqual(1)
  expect(position.getZ()).toStrictEqual(undefined)

  const position3D = new Position(0, 1, 2)

  expect(position3D.getX()).toStrictEqual(0)
  expect(position3D.getY()).toStrictEqual(1)
  expect(position3D.getZ()).toStrictEqual(2)
})
