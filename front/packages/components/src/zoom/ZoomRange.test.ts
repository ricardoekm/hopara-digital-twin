import { ZoomRange } from './ZoomRange'

export function clone<T>(instance: T, props = {}): T {
  const copy = new ((instance as any).constructor as { new (): T })()
  Object.assign(copy as any, instance)
  Object.assign(copy as any, props)
  return copy
}

 
test('should multiply the range value', () => {
  const sourceRange = new ZoomRange({min: {value: 0}, max: {value: 1}})
  const expectedRange = new ZoomRange({min: {value: -0.5}, max: {value: 1.5}})

  expect(sourceRange.multiply(2)).toEqual(expectedRange)
})
