import { objectsToString } from './ObjectsToString'

test('Objects to string', () => {
  const params = {number: 10, object: {string: 'abc'}}
  const convertedParams = objectsToString(params)

  expect(convertedParams.number).toEqual(10)
  expect(convertedParams.object).toEqual(`{"string":"abc"}`)
})
