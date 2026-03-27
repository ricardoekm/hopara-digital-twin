import { cloneDeep } from 'lodash'

export function clone<T>(instance: T, props = {}): T {
  const copy = new ((instance as any).constructor as { new (): T })()
  Object.assign(copy as any, instance)
  Object.assign(copy as any, cloneDeep(props))
  return copy
}
