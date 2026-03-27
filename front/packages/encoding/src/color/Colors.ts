import {rgb as d3RGB} from 'd3'
import { isNumber } from 'lodash/fp'

export type RgbaColor = [number, number, number, number]
export const TRANSPARENT_COLOR = [255, 255, 255, 0] as RgbaColor
export const WHITE_COLOR = [255, 255, 255, 255] as RgbaColor
export const RED_COLOR = [255, 59, 40, 255]
export const GREEN_COLOR = [72, 235, 18, 255]
export const BLUE_COLOR = [0, 167, 250, 255]

export const rgbColor = (hexColor:string): any => {
  return d3RGB(hexColor)
}

export const getAlpha = (opacity:number): number => {
  const maxOpacity = 255
  if (isNumber(opacity) && opacity <= 1 && opacity >= 0) {
    return Math.floor(maxOpacity * opacity)
  }
  return maxOpacity
}

export function toRGBArray(color: any): RgbaColor {
  const colorArr = [color.r, color.g, color.b]
  if (color.opacity !== undefined) colorArr.push(getAlpha(color.opacity))
  return colorArr as RgbaColor
}

export function fromString(cssColorSpecifier: string, opacity = 1): RgbaColor {
  const color = d3RGB(cssColorSpecifier)
  color.opacity = opacity
  return toRGBArray(color)
}
