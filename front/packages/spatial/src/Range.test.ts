import {Range} from './Range'

export function clone<T>(instance: T, props = {}): T {
  const copy = new ((instance as any).constructor as { new (): T })()
  Object.assign(copy as any, instance)
  Object.assign(copy as any, props)
  return copy
}

test('should multiply the range value', () => {
  const sourceRange = new Range({min: 0, max: 1})
  const expectedRange = new Range({min: -0.5, max: 1.5})

  expect(sourceRange.multiply(2)).toEqual(expectedRange)
})

test('interval with negative numbers', () => {
  const range1 = new Range({min: -20, max: -10})
  expect(range1.getInterval()).toEqual(10)

  const range2 = new Range({min: -10, max: 10})
  expect(range2.getInterval()).toEqual(20)
})

