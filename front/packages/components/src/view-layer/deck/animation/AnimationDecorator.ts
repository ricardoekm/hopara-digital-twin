import { testCondition } from '@hopara/encoding'
import { DeckLayerProps } from '../../DeckLayerFactory'
import { AnimationEngine } from '../../../animation/AnimationEngine'
import { BaseFactory } from '../factory/BaseFactory'
import { ExtensionsManager, ExtensionType } from '../ExtensionsManager'

export function decorateAnimation(layerProps: DeckLayerProps, deckProps: any) {
  const animationEncoding = layerProps.encoding.animation
  const enabled = animationEncoding?.enabled
  const decoratedProps = {...deckProps}
  const colorAnimations = AnimationEngine.getColorAnimations(layerProps.encoding, deckProps)
  const sizeAnimations = AnimationEngine.getSizeAnimations(layerProps.encoding, deckProps)

  decoratedProps.isColorAnimated = (row) => colorAnimations.length && enabled && testCondition(animationEncoding?.condition, row, true) ? 1 : 0
  decoratedProps.isSizeAnimated = (row) => sizeAnimations.length && enabled && testCondition(animationEncoding?.condition, row, true) ? 1 : 0

  decoratedProps.updateTriggers = {
    ...deckProps.updateTriggers,
    isColorAnimated: BaseFactory.createEncodingTriggers(layerProps.encoding.color, layerProps.rows),
    isSizeAnimated: BaseFactory.createEncodingTriggers(layerProps.encoding.size, layerProps.rows),
  }

  decoratedProps.extensions = ExtensionsManager.add(deckProps.extensions, ExtensionType.animation, {
    colorAnimations,
    sizeAnimations,
    enabled: layerProps.encoding.animation?.enabled,
    animationFps: layerProps.animationFps
  })
  
  return decoratedProps
}
