import { AnimationType, AnimationSpeed } from '@hopara/encoding'
import { getAnimationTemplate } from './AnimationTemplates'

export const getCssAnimation = (type: AnimationType, speed?: AnimationSpeed) => {
  const x = getAnimationTemplate(type, speed)
  const keyFrames = x.keyFrames ?? {}
  
  return {
    duration: `${x.duration ?? 0}ms`,
    keyFrames: Object.entries(keyFrames).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: {
        transform: `scale(${value?.scale ?? 1})`,
        opacity: value?.opacity,
        transformOrigin: 'center',
      },
    }), {}),
  }
}
