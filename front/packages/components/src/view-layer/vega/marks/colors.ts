import { RGBAColor } from '@deck.gl/core/utils/color'
import { fromString } from '@hopara/encoding/src/color/Colors'

export const getFillColor = (item): RGBAColor => {
  let fillColor = [0, 0, 0, 0]
  if (item.fill && item.fill !== 'transparent') {
    fillColor = fromString(item.fill, item.opacity)
  }

  if (fillColor[3]) {
    if (item.fillOpacity) {
      fillColor[3] *= item.fillOpacity
    } else if (item.opacity) {
      fillColor[3] *= item.opacity
    }
  }

  return fillColor as RGBAColor
}

export const getStrokeColor = (item): RGBAColor => {
  let strokeColor = [0, 0, 0, 0]
  if (item.stroke && item.stroke !== 'transparent') {
    strokeColor = fromString(item.stroke, item.opacity)
  }

  if (strokeColor[3]) {
    if (item.fillOpacity) {
      strokeColor[3] *= item.fillOpacity
    } else if (item.opacity) {
      strokeColor[3] *= item.opacity
    }
  }

  return strokeColor as RGBAColor
}
