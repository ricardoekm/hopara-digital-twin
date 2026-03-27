import { notExistsToUndefined } from './NotExistsToUndefined'

test('Set undefined not existing keys', () => {
  const obj = { id: '123' } as any
  notExistsToUndefined(obj, ['id', 'name'])

  const keys = Object.keys(obj)
  expect(keys).toHaveLength(2)
  expect(obj.id).toBe('123')
  expect(obj.name).toBe(undefined)
})
