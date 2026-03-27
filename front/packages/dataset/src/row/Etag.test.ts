import { Etag } from './Etag'

test('Get value', () => {
  const etag = new Etag('123456')
  expect(etag.getValue()).toEqual('123456')
})

test('Update modifier value', () => {
  const etag = new Etag('123')
  etag.updateModifier('normalizer', '456')
  etag.updateModifier('normalizer', '789')
  expect(etag.getValue()).toEqual('123#789')
})
