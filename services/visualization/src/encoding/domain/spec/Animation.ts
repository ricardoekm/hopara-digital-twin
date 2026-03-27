import { Condition } from './Condition.js'

interface Channel {
  duration: number,
  repeat?: number | null,
}

export interface SizeAnimation {
  channel: Channel,
  keyFrames: any
}

export interface ColorAnimation {
  channel: Channel,
  keyFrames: any,
}

export enum AnimationType {
  custom = 'custom',
  pulse = 'pulse',
  ripple = 'ripple',
  fadeInOut = 'fadeInOut',
  blink = 'blink',
  flow = 'flow',
}

export interface AnimationEncoding {
  type?: AnimationType
  enabled?: boolean
  speed?: number
  condition?: Condition
}
