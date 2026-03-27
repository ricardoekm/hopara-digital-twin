import {Feature, FeatureCollection, LineString, Point, Polygon, polygon as turfPolygon, point as turfPoint, lineString as turfLineString} from '@turf/helpers'
import { isEqual } from 'lodash/fp'

export function isLine(rowValue: any[]): boolean {
  if (rowValue.length <= 1) return false

  const firstPoint = rowValue[0]
  const lastPoint = rowValue[rowValue.length - 1]
  return JSON.stringify(firstPoint) !== JSON.stringify(lastPoint)
}

export function toPolygon(geometry: any[]): Feature<Polygon> {
  return turfPolygon([geometry])
}

export function toLineString(geometry: any[]): Feature<LineString> {
  return turfLineString(geometry)
}

export function toPoint(geometry: any[]): Feature<Point> {
  return turfPoint(geometry)
}

export function toGeometry(plainGeometry: any[]): Feature<LineString | Polygon> {
  if (!isEqual(plainGeometry[0], plainGeometry[plainGeometry.length - 1])) return toLineString(plainGeometry)
  return toPolygon(plainGeometry)
}

export function toFeatureCollection(geometry: any[]): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: [toPolygon(geometry)],
  }
}
