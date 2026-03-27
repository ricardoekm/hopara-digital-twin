import {ColorAnimation} from './Animation.js'
import { ColorCondition } from './Condition.js'

export enum ColorScaleType {
  sorted='sorted',
  hashed='hashed',
  grouped='grouped',
  linear='linear'
}

export type ColorDomain = string | number

export type ColorScale = {
  type?: ColorScaleType

  values?: ColorDomain[]

  /**
  * @description An array of colors.
  */
  colors?: ColorLiteral[]

  /**
  * @description A valid [vega scheme](https://vega.github.io/vega/docs/schemes/) or array of colors.
  */
  scheme?: string

    /**
   * @description Reverse the color order described by the scheme or range attribute.
   * @default false
   */
  reverse?: boolean
}

/**
 * @description A CSS color string, for example: #f304d3, #ccc, rgb(253, 12, 134), steelblue.
*/
export type ColorLiteral = string

type OpacityEncoding = {
  /**
   * @description A number from 0 to 1 (e.g. 0.8).
   * @default 1
   * @minimum 0
   * @maximum 1
   */
  opacity?: number
}

interface ColorEncodingBase extends OpacityEncoding {
  field?: string | null

  /**
   * @description The color to be used when field attribute is not specified or the value pointed by it is null. Accepts a CSS color string, for example: #f304d3, #ccc, rgb(253, 12, 134), steelblue.
   * @default #000000
   */
  value?: ColorLiteral
  scale?: ColorScale
  conditions?: ColorCondition[]
}

interface AnimatedColorEncoding<TAnimation> extends ColorEncodingBase {
  animation?: TAnimation
}

export type ColorEncoding = AnimatedColorEncoding<ColorAnimation>

export type LineColorEncoding = ColorEncodingBase

export type StrokeColorEncoding = AnimatedColorEncoding<ColorAnimation>

export interface ModelColorEncoding extends ColorEncodingBase {
  /**
   * @description The color to be used when field attribute is not specified or the value pointed by it is null. Accepts a CSS color string, for example: #f304d3, #ccc, rgb(253, 12, 134), steelblue.
   */
  value?: ColorLiteral
}

export interface ImageColorEncoding extends OpacityEncoding {
  /**
   * @description A number from 0 to 1 (e.g. 0.8).
   * @default 1
   * @minimum 0
   * @maximum 1
   */
  opacity?: number

  /**
   * @description A number from 0 to 1 (e.g. 0.8).
   * @default 1
   * @minimum 0
   * @maximum 1
   */
  saturation?: number
}


