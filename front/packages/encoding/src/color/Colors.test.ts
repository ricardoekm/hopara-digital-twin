import { getAlpha } from './Colors'

it('should get alpha', () => {
  expect(getAlpha(1)).toBe(255)
  expect(getAlpha(0.5)).toBe(127)
  expect(getAlpha(0)).toBe(0)
})
