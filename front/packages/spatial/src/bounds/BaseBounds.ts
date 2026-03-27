import { scale } from 'vega'
import {featureCollection, polygon as createPolygon} from '@turf/helpers'
import { Position2D } from '../Position'

export type PlainBounds = [Position2D, Position2D, Position2D, Position2D] | [Position2D, Position2D, Position2D, Position2D, Position2D]

export class BaseBounds extends Array<Position2D> {
  getBottomLeft() {
    return this[0]
  }

  getTopLeft() {
    return this[1]
  }

  getTopRight() {
    return this[2]
  }

  getBottomRight() {
    return this[3]
  }

  getBoundingBox() {
    const polygon = this.toPolygon()
    const minX = Math.min(...polygon.map((position) => position[0]))
    const minY = Math.min(...polygon.map((position) => position[1]))
    const maxX = Math.max(...polygon.map((position) => position[0]))
    const maxY = Math.max(...polygon.map((position) => position[1]))
    return [[minX, minY], [maxX, maxY]]
  }

  toPolygon() {
    return [
      this.getBottomLeft(),
      this.getTopLeft(),
      this.getTopRight(),
      this.getBottomRight(),
      this.getBottomLeft(),
    ]
  }

  toGeoJSON() {
    const polygon = createPolygon([[
      this.getBottomLeft(),
      this.getTopLeft(),
      this.getTopRight(),
      this.getBottomRight(),
      this.getBottomLeft(),
    ]])

    return polygon
  }

  toFeatureCollection() {
    return featureCollection([this.toGeoJSON()])
  }

  toBBox() {
    return [
      this.getBottomLeft()[0],
      this.getBottomLeft()[1],
      this.getTopRight()[0],
      this.getTopRight()[1],
    ]
  }

  private getScales(bbox: number[][]) {
    const scaleX = scale('linear')()
      .domain([0, 100])
      .range([bbox[0][0], bbox[1][0]])
    const scaleY = scale('linear')()
      .domain([100, 0])
      .range([bbox[0][1], bbox[1][1]])

    return { scaleX, scaleY }
  }
  
  projectGeometry(geometry: number[][]) {
    const bbox = (this as any).rotateToBearing(0).getBoundingBox()
    const {scaleX, scaleY} = this.getScales(bbox)
    const projected = geometry.map(([x, y]) => [scaleX(x), scaleY(y)])
    return (this as any).rotateGeometry(projected)
  }

  unprojectGeometry(geometry: number[][]) {
    const bbox = (this as any).rotateToBearing(0).getBoundingBox()
    const rotatedGeometry = (this as any).rotateGeometry(geometry, true)
    const {scaleX, scaleY} = this.getScales(bbox)
    return rotatedGeometry.map(([x, y]) => [scaleX.invert(x), scaleY.invert(y)])
  }
}
