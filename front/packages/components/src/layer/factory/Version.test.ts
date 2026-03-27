import { isVersionGte } from './Version'

test('Greater than or equal to 0.58', () => {
  expect(isVersionGte('0.59', '0.58')).toBe(true)
  expect(isVersionGte('0.58', '0.58')).toBe(true)
  expect(isVersionGte('0.57', '0.58')).toBe(false)
  expect(isVersionGte('1.0', '0.58')).toBe(true)
})
