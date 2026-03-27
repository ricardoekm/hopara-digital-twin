import { BaseEncoding } from '../BaseEncoding'
import { Condition } from '../condition/Condition'

export enum AnimationType {
  custom = 'custom',
  pulse = 'pulse',
  ripple = 'ripple',
  fadeInOut = 'fadeInOut',
  blink = 'blink',
  flow = 'flow',
}

export type AnimationSpeed = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export class AnimationEncoding extends BaseEncoding<AnimationEncoding> {
  type: AnimationType
  enabled: boolean
  speed: AnimationSpeed
  condition: Condition

  constructor(props: Partial<AnimationEncoding>) {
    super()
    Object.assign(this, props)
  }

  isRenderable() {
    return true
  }

  getTestField() {
    return this.condition?.test?.field
  }

  getTestReverse() {
    return !!this.condition?.test?.reverse
  }
}
