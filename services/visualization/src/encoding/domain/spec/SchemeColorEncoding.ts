import { ColorScale } from './ColorEncoding.js'

export interface SchemeColorEncoding {
  /**
   * @description A number from 0 to 1 (e.g. 0.8).
   * @default 1
   * @minimum 0
   * @maximum 1
   */
  opacity?: number

  scale?: ColorScale
}
