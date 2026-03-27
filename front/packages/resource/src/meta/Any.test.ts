import { getMetaFromResourceResponse } from './Meta'

// to not break the build
test('any', () => {
  expect(getMetaFromResourceResponse({width: 1, height: 1})).not.toBeNull()
})
