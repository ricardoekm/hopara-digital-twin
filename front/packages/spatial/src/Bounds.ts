import { Position } from './Position'
import { WebMercatorBounds } from './bounds/WebMercatorBounds'
import { OrthographicBounds } from './bounds/OrthographicBounds'

export enum BoundsOrientation {
  PORTRAIT = 'PORTRAIT',
  LANDSCAPE = 'LANDSCAPE',
  SQUARE = 'SQUARE',
}

export interface BoundsOptions {
  orthographic?: boolean
  flipY?: boolean
}

export class Bounds extends Array<Position> {
  static fromGeometry(geometry: number[][], options?: BoundsOptions): OrthographicBounds | WebMercatorBounds {
    if (options?.orthographic) {
      return OrthographicBounds.fromGeometry(geometry, options.flipY)
    }
    return WebMercatorBounds.fromGeometry(geometry)
  }

  static fromBBox(bbox: [[number, number], [number, number]], options?: BoundsOptions): OrthographicBounds | WebMercatorBounds {
    const [[minX, minY], [maxX, maxY]] = bbox
    const geometry = [
      [minX, minY],
      [maxX, minY],
      [maxX, maxY],
      [minX, maxY],
      [minX, minY],
    ]
    return Bounds.fromGeometry(geometry, options)
  }
}

export class BoundsFactory {

}
