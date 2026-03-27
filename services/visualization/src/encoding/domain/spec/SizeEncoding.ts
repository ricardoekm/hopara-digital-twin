import {SizeAnimation} from './Animation.js'

export type SizeScale = {
  /**
  * @description An array of sizes.
  */
  range?: number[]
}

export enum SizeUnits {
  METERS = 'meters',
  PIXELS = 'pixels',
  COMMONS = 'common',
}

/**
 * @description A size encoding that uses a fixed size or field based size.
 */
export interface SizeEncoding {
  animation?: SizeAnimation

  /**
   * @description The size in pixels. If field is specified, this value will be used as a fallback.
   * @default 32
   */
  value?: number

  /**
   * @description The field to use as a scale.
   */
  field?: string | null

  /**
  * @description If defined then the size specified in value will be fixed at this zoom level, and scale up or down from there.
  */
  scale?: SizeScale

  /**
  * @description Used as pixel reference if resize is true
  */
  referenceZoom?:number
}

export interface SizeMultiplierEncoding {
  multiplier?: number
}

export interface StrokeSizeEncoding extends SizeEncoding {
  /**
   * @description The size in pixels. If field is specified, this value will be used as a fallback.
   * @default 0
   */
  value?: number
}

export interface BorderRadiusEncoding extends SizeEncoding {
  /**
   * @description The size in pixels. If field is specified, this value will be used as a fallback.
   * @default 1
   */
  value?: number
}
