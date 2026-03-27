import { Padding } from '@deck.gl/core/typed/viewports/viewport'
import { Point, lineLength, lineMidpoint } from 'geometric'
import { isNumber } from 'lodash/fp'

const getPaddingObject = (padding: number | Required<Padding> = 0): Required<Padding> => {
  if (isNumber(padding)) {
    return {
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
    }
  }

  return padding
}

export const fitBounds = (
  bounds: [[number, number], [number, number]],
  width = 1,
  height = 1,
  scaleFactor = 1,
  maxZoom = 24,
  minExtent = 0.01,
  padding: number | Required<Padding> = 0,
  offset = [0, 0]) => {
  const [[minX, minY], [maxX, maxY]] = bounds
  const bottomLeft = [minX, minY] as Point
  const topRight = [maxX, maxY] as Point
  const topLeft = [minX, maxY] as Point
  
  const dimensions = {
    width: Math.max(lineLength([topLeft, topRight]), minExtent ?? 0.01) / scaleFactor,
    height: Math.max(lineLength([topLeft, bottomLeft]), minExtent ?? 0.01) / scaleFactor,
  }

  const paddingObj = getPaddingObject(padding)
  const targetDimensions = {
    width: width - paddingObj.left - paddingObj.right - Math.abs(offset[0]) * 2,
    height: height - paddingObj.top - paddingObj.bottom - Math.abs(offset[1]) * 2,
  }

  const scaleX = targetDimensions.width / dimensions.width
  const scaleY = targetDimensions.height / dimensions.height
  const offsetX = Math.abs(offset[0])
  const offsetY = Math.abs(offset[1])

  const zoom = Math.min(maxZoom, Math.log2(Math.abs(Math.min(scaleX, scaleY))))
  const target = [lineMidpoint([topLeft, topRight])[0] + offsetX, lineMidpoint([topLeft, bottomLeft])[1] + offsetY]

  return {zoom, target}
}
