import { WebMercatorViewport as DeckWebMercatorViewport} from '@deck.gl/core/typed'
import { Box, Coordinates, Dimensions } from '@hopara/spatial'
import { getSizeCommons, getSizePixels, getVisibleWorld, getVisibleWorldDimensions } from './Viewport'

export default class WebMercatorViewport extends DeckWebMercatorViewport {
  getVisibleWorld(): Box {
    return getVisibleWorld(this)
  }

  getVisibleWorldDimensions(): Dimensions {
    return getVisibleWorldDimensions(this)
  }

  getSizePixels(value: number, unit?: string, targetZoom?: number, scale?: boolean): number {
    return getSizePixels(this, value, unit, targetZoom, scale)
  }

  getSizeCommons(value: number, unit?: string, targetZoom?: number, scale?: boolean): number {
    return getSizeCommons(this, value, unit, targetZoom, scale)
  }

  isPolygonInRange(polygon: number[][]) {
    return this.getVisibleWorld().isPolygonInRange(polygon)
  }

  somePolygonInRange(polygons: number[][][]) {
    return polygons.some((polygon) => this.isPolygonInRange(polygon))
  }

  isCoordinateInRange(coordinates: Coordinates, visibleWorld?: Box) {
    const world = visibleWorld || this.getVisibleWorld()
    return !!world?.isPointInRange(coordinates)
  }

  // eslint-disable-next-line no-restricted-syntax
  get ViewportType() {
    return WebMercatorViewport
  }
}
