import { AnimationType } from '@hopara/encoding'
import { LayerType } from '../LayerType'

export const animationLayerTypes = {
  [AnimationType.pulse]: [LayerType.circle, LayerType.icon],
  [AnimationType.ripple]: [LayerType.circle, LayerType.icon],
  [AnimationType.fadeInOut]: [LayerType.circle, LayerType.icon, LayerType.polygon],
  [AnimationType.blink]: [LayerType.circle, LayerType.icon, LayerType.polygon],
  [AnimationType.flow]: [LayerType.line],
}
