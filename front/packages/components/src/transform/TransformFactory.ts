import { Transform } from '@hopara/encoding/src/transform/Transform'

export const TransformFactoryToken = Symbol('TransformFactoryToken')

export interface TransformFactory {
  create(rawTransform:any) : Transform | undefined
}
