import { AnimationSpeed } from '@hopara/encoding'

export const MAX_ANIMATION_DURATION = 2700
export const DEFAULT_ANIMATION_SPEED = 5
export const MIN_ANIMATION_SPEED = 1
export const MAX_ANIMATION_SPEED = 10

export function speedToDuration(speed: AnimationSpeed) {
  return MAX_ANIMATION_DURATION - ((speed - 1) * 300)
}
