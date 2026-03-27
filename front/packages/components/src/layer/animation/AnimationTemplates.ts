import { AnimationType, AnimationSpeed } from '@hopara/encoding'
import { DEFAULT_ANIMATION_SPEED, speedToDuration } from './AnimationSpeed'

export type KeyFrames = Record<string, {
  scale?: number,
  opacity?: number,
}>

export interface LayerAnimationData {
  duration: number,
  keyFrames: KeyFrames
}

export const getAnimationTemplate = (type: AnimationType, speed: AnimationSpeed = DEFAULT_ANIMATION_SPEED) => {
  const duration = speedToDuration(speed)

  const templates: Record<AnimationType | string, LayerAnimationData> = {
    pulse: {
      duration,
      keyFrames: {
        '0%': {scale: 1},
        '60%': {scale: 1.2},
        '90%': {scale: 1},
      },
    },
    ripple: {
      duration,
      keyFrames: {
        '0%': {opacity: 0.7, scale: 1},
        '70%': {opacity: 0, scale: 2},
        '100%': {opacity: 0, scale: 2},
      },
    },
    blink: {
      duration,
      keyFrames: {
        '0%': {opacity: 1},
        '80%': {opacity: 1},
        '81%': {opacity: 0},
        '100%': {opacity: 0},
      },
    },
    fadeInOut: {
      duration,
      keyFrames: {
        '0%': {opacity: 0},
        '50%': {opacity: 1},
        '100%': {opacity: 0},
      },
    },
    flow: {
      duration: duration * 10,
      keyFrames: {},
    },
  }
  return templates[type]
}
