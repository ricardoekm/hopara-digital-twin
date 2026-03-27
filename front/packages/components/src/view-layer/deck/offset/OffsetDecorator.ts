import { DeckLayerProps } from '../../DeckLayerFactory'
import { ExtensionType, ExtensionsManager } from '../ExtensionsManager'

export function decorateOffset(layerProps: DeckLayerProps, deckProps: any) {
  const decoratedProps = {...deckProps}

  const multiplier = layerProps.encoding?.size?.multiplier ?? 1
  const offset = layerProps.encoding?.offset
  decoratedProps.offsetY = (offset?.y?.getRenderValue() ?? 0) * multiplier
  decoratedProps.offsetX = (offset?.x?.getRenderValue() ?? 0) * multiplier
  decoratedProps.offsetUnits = layerProps.encoding?.getUnits()
  decoratedProps.offsetMaxZoom = layerProps.encoding?.config?.maxResizeZoom

  decoratedProps.extensions = ExtensionsManager.add(deckProps.extensions, ExtensionType.offset)

  return decoratedProps
}
