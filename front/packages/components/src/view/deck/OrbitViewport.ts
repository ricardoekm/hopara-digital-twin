import { OrbitViewport as DeckOrbitViewport} from '@deck.gl/core/typed'
import { Padding } from '@deck.gl/core/typed/viewports/viewport'
import { Box, Coordinates, Dimensions } from '@hopara/spatial'
import { getSizeCommons, getSizePixels, getVisibleWorld, getVisibleWorldDimensions } from './Viewport'

export default class OrbitViewport extends DeckOrbitViewport {
  visibleWorld!: Box

  getVisibleWorld(): Box {
    if (!this.visibleWorld) {
      this.visibleWorld = getVisibleWorld(this)
    }

    return this.visibleWorld
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

  isPolygonInRange(polygon: number[][], visibleWorld?: Box) {
    const world = visibleWorld || this.getVisibleWorld()
    return world.isPolygonInRange(polygon)
  }

  somePolygonInRange(polygons: number[][][]) {
    return polygons.some((polygon) => this.isPolygonInRange(polygon))
  }

  isCoordinateInRange(coordinates: Coordinates, visibleWorld?: Box) {
    const world = visibleWorld || this.getVisibleWorld()
    return !!world?.isPointInRange(coordinates)
  }

  // TODO: should be implemented
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fitBounds(bounds: [[number, number], [number, number]], options: {
      /** If not supplied, will use the current width of the viewport (default `1`) */
      width?: number;
      /** If not supplied, will use the current height of the viewport (default `1`) */
      height?: number;
      /** In degrees, 0.01 would be about 1000 meters */
      minExtent?: number;
      /** Max zoom level */
      maxZoom?: number;
      /** Extra padding in pixels */
      padding?: number | Required<Padding>;
      /** Center shift in pixels */
      offset?: number[];
    }) {
    return this
  }

  unproject(xyz: number[], {topLeft = true, invertAxis = false}: {topLeft?: boolean, invertAxis?: boolean} = {}): [number, number, number] {
    const [X, Z, Y] = super.unproject(xyz, {topLeft})
    return invertAxis ? [X, Y, Z] : [X, Z, Y]
  }

  // eslint-disable-next-line no-restricted-syntax
  get ViewportType() {
    return OrbitViewport
  }
}
