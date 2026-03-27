import {AnimationType, Condition, Encodings, AnimationSpeed} from '@hopara/encoding'
import { speedToDuration } from './animation/AnimationSpeed'
import { getViewLayerEncodings } from './animation/ViewLayerAnimation'

export const DEFAULT_SEGMENT_LENGTH = 100

export class EncodingAnimation {
  type: AnimationType
  condition: Condition
  speed: AnimationSpeed

  constructor(props: Partial<EncodingAnimation>) {
    Object.assign(this, props)
  }
  
  getEncodings(): Partial<Encodings> {    
    const encodings = {}
    const encodingKeys = ['color', 'size']
    if (this.type === AnimationType.flow) {
      encodings['color'] = {}
      encodings['color'].animation = {
        channel: {
          duration: speedToDuration(this.speed),
        },
        keyFrames: {},
      }
      return encodings
    }

    const viewLayerEncodings = getViewLayerEncodings(this.type, this.speed)
    encodingKeys.forEach((encodingName) => {
        const animationEncodingTemplate = viewLayerEncodings[encodingName]
        if (!animationEncodingTemplate) return
        if (!encodings[encodingName]) {
          encodings[encodingName] = {}
        }

        encodings[encodingName].animation = animationEncodingTemplate
      })

    return encodings
  }
}
