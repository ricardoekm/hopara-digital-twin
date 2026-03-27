import { AnimationType, AnimationSpeed } from '@hopara/encoding'
import { getAnimationTemplate, KeyFrames } from './AnimationTemplates'
import { Logger } from '@hopara/internals'

interface DeckEncodingAnimation {
  channel: {
    duration: number
  }
  keyFrames: KeyFrames
}

interface DeckEncodingsAnimation {
  color?: DeckEncodingAnimation
  size?: DeckEncodingAnimation
}

export const getViewLayerEncodings = (type: AnimationType, speed?: AnimationSpeed): DeckEncodingsAnimation => {
  const data = getAnimationTemplate(type, speed)
  if (!data) {
    Logger.error(`Animation template not found: ${type}`)
  }

  return {
    color: {
      channel: {
        duration: data.duration,
      },
      keyFrames: Object.fromEntries(Object.entries(data.keyFrames).map(([key, value]) => [key, {opacity: value.opacity}])),
    },
    size: {
      channel: {
        duration: data.duration,
      },
      keyFrames: Object.fromEntries(Object.entries(data.keyFrames).map(([key, value]) => [key, {scale: value.scale}])),
    },
  }
}
