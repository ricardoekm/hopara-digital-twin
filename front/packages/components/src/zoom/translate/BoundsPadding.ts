import {Dimensions} from '@hopara/spatial'
import {isNil} from 'lodash/fp'

export const DEFAULT_PADDING = 10
export const MAX_PADDING = 50
export const MAX_SAFE_PADDING = 49.9

function getPadding(padding: number | undefined) {
  if (!isNil(padding)) {
    return Math.min(padding, MAX_SAFE_PADDING)
  }
  return DEFAULT_PADDING
}

export const getBoundsPadding = (padding: number | undefined, dimensions: Dimensions) => {
  const paddingOrDefault = getPadding(padding)
  const verticalPadding = dimensions.height * (paddingOrDefault / 100)
  const horizontalPadding = dimensions.width * (paddingOrDefault / 100)

  return {
    top: verticalPadding,
    bottom: verticalPadding,
    left: horizontalPadding,
    right: horizontalPadding,
  }
}

