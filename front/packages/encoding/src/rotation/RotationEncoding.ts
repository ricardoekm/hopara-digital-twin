import { BaseEncoding } from '../BaseEncoding'

export interface RotationFieldEncoding {
  field: string
}

export class RotationEncoding extends BaseEncoding<RotationEncoding> {
  x: RotationFieldEncoding
  y: RotationFieldEncoding
  z: RotationFieldEncoding
  value?: [number, number, number]

  constructor(props?: Partial<RotationEncoding>) {
    super()
    Object.assign(this, props)
  }

  isRenderable(): boolean {
    return true
  }
}
