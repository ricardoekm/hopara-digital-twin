import { nullToUndefined } from './NullToUndefined'

test('Null to undefined', () => {
  const obj = {
    a: null,
    b: 1,
    c: {
      a: null,
      b: 1,
    },
    d: [null, 1, 2],
  }
  const result = nullToUndefined(obj)
  
  expect(result.a).toBeUndefined()
  expect(result.b).toEqual(1)
  expect(result.c.a).toBeUndefined()
  expect(result.c.b).toEqual(1)
  expect(result.d).toEqual([undefined, 1, 2])
})
