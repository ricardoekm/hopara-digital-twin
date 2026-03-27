import {Geometric} from './Geometric'
import {
  Feature,
  FeatureCollection,
  LineString,
  point as turfPoint,
  Point as TurfPoint,
  polygon as turfPolygon,
  Polygon as TurfPolygon,
  Position as TurfPosition,
  lineString as turfLineString,
  Properties,
  BBox,
} from '@turf/helpers'
import {getCoord, getCoords} from '@turf/invariant'
import lineToPolygon from '@turf/line-to-polygon'
import { polygonToLine } from '@turf/polygon-to-line'
import {
  lineAngle,
  lineLength,
  lineMidpoint,
  lineRotate,
  lineTranslate,
  Point,
  pointTranslate,
  polygonCentroid,
  polygonRotate,
  polygonScaleX,
  polygonScaleY,
  polygonTranslate,
} from 'geometric'
import { isEqual, maxBy, minBy } from 'lodash/fp'

export function getDistance(p1: TurfPosition, p2: TurfPosition, mapCoords: TurfPosition): number {
  const x1 = p1[0]
  const y1 = p1[1]
  const x2 = p2[0]
  const y2 = p2[1]
  const xCoords = mapCoords[0]
  const yCoords = mapCoords[1]

  const a = y1 - y2
  const b = x2 - x1
  const c = (x1 * y2) - (x2 * y1)
  if (a === 0 && b === 0 && c === 0) return 0

  return Math.abs(a * xCoords + b * yCoords + c) / Math.sqrt(a * a + b * b)
}

export class OrthographicGeometric implements Geometric {
  private getPolygon(geometry: Feature<TurfPolygon | LineString>) {
    const coords = getCoords(geometry)
    return coords.length > 1 ? coords : coords[0] as Point[]
  }

  private getPoint(point: Feature<TurfPoint>) {
    return getCoords(point.geometry) as Point
  }

  private toPoint(geometry: Point) {
    return turfPoint(geometry)
  }

  getBounds(geometry: Feature<TurfPolygon | LineString>) {
    const coords = this.getPolygon(geometry)
    const minX = minBy((coord: number) => coord[0], coords)![0]
    const maxX = maxBy((coord: number) => coord[0], coords)![0]
    const minY = minBy((coord: number) => coord[1], coords)![1]
    const maxY = maxBy((coord: number) => coord[1], coords)![1]
    return [minX, minY, maxX, maxY]
  }

  getBBox(geometry: Feature<TurfPolygon | LineString>) {
    const [minX, minY, maxX, maxY] = this.getBounds(geometry as any)
    return turfPolygon([[
      [minX, minY],
      [maxX, minY],
      [maxX, maxY],
      [minX, maxY],
      [minX, minY]
    ]])
  }

  getRotatedBBox(geometry: FeatureCollection) {
    const coords = this.getPolygon(geometry.features[0] as any)
    const angle = lineAngle([coords[0], coords[1]])
    const centroid = this.getCentroid(geometry)
    const normalized = coords.length > 2 ?
                       this.polygonRotate(geometry.features[0] as any, -angle, centroid) :
                       turfLineString(lineRotate([coords[0], coords[1]], -angle))
    const [minX, minY, maxX, maxY] = this.getBounds(normalized as any)
    const boundingBox = [
      [maxX, maxY],
      [maxX, minY],
      [minX, minY],
      [minX, maxY],
      [maxX, maxY],
    ] as any

    const bboxFeature = this.polygonRotate(boundingBox, angle, centroid)
    return polygonToLine(bboxFeature) as Feature<LineString>
  }

  getNormalizedBBox(polygon: Feature<TurfPolygon>) {
    const coords = this.getPolygon(polygon)
    const angle = lineAngle([coords[1], coords[2]])
    const centroid = this.getCentroid(polygon)
    const normalized = coords.length > 2 ?
                       this.polygonRotate(polygon, -angle, centroid) :
                       turfLineString(lineRotate([coords[0], coords[1]], -angle))
    return this.getBounds(normalized as any) as BBox
  }

  getCentroid(geometry: FeatureCollection | Feature) {
    const coords = this.getPolygon('features' in geometry ? geometry.features[0] : geometry as any)
    const centroid = coords.length === 2 ? lineMidpoint([coords[0], coords[1]]) : polygonCentroid(coords as any)
    return this.toPoint(centroid)
  }

  getScaleFactor(centroid: TurfPoint, startDragPoint: TurfPoint, currentPoint: TurfPoint) {
    const startDistance = lineLength([centroid, startDragPoint] as any)
    const endDistance = lineLength([centroid, currentPoint] as any)
    return endDistance / startDistance
  }

  polygonRotate(geometry: Feature<TurfPolygon>, angle: number, centroid: Feature<TurfPoint>) {
    const pol = this.getPolygon(geometry)
    const point = this.getPoint(centroid)
    const rotated = pol.length === 2 ? lineRotate([pol[0], pol[1]], angle, point) : polygonRotate(pol, angle, point)
    return isEqual(rotated[0], rotated[rotated.length - 1]) ? turfPolygon([rotated]) : lineToPolygon(turfLineString(rotated)) as Feature<TurfPolygon>
  }

  getMidPoint(point1: TurfPoint, point2: TurfPoint) {
    return this.toPoint(lineMidpoint([point1, point2] as any))
  }

  getTopMidPoint(geometry: Feature<TurfPolygon>) {
    const coords = this.getPolygon(geometry) as any
    return this.getMidPoint(coords[2], coords[3])
  }

  getLineBearing(point1: TurfPoint, point2: TurfPoint) {
    return lineAngle([point1 as any, point2 as any])
  }

  getBearing(coordinate: Feature<TurfPolygon>): number {
    const coords = this.getPolygon(coordinate) as any
    return this.getLineBearing(coords[0], coords[1])
  }

  getDistance(point1: Feature<TurfPoint, Properties>, point2: Feature<TurfPoint, Properties>): number {
    return lineLength([getCoords(point1) as any, getCoords(point2) as any])
  }

  lineRotate(line: Feature<LineString>, angle: number, pivot: Feature<TurfPoint>): Feature<LineString> {
    const rotatedLine = polygonRotate(getCoords(line), angle, this.getPoint(pivot))
    return turfLineString(rotatedLine)
  }

  scalePolygon(polygon: Feature<TurfPolygon>, scaleFactor: number, pivot: Feature<TurfPoint>, originIndex: number) {
    const polygonCoords = this.getPolygon(polygon as any)
    if ((originIndex === 0 || originIndex === 2)) {
      const scaledPolygon = polygonScaleX(polygonCoords, scaleFactor, getCoord(pivot as any) as any) 
      return turfPolygon([scaledPolygon])
    }
    const scaledPolygon = polygonScaleY(polygonCoords, scaleFactor, getCoord(pivot as any) as any)
    return turfPolygon([scaledPolygon])
  }

  translate(geometry: Feature, distance: number, angle: number): Feature {
    const polygon = getCoords(geometry as any)[0]
    if (polygon.length === 1) return turfPoint(pointTranslate(polygon[0], angle, distance))
    if (polygon.length === 2) return turfLineString(lineTranslate(polygon as any, angle, distance))
    const translated = polygonTranslate(polygon as any, angle, distance) as any
    return turfPolygon([translated])
  }

  translateToCoordinates(geometry: Feature<TurfPolygon>, coordinates: number[]): number[] {
    const centroid = this.getCentroid(geometry)
    const angle = this.getLineBearing(getCoords(centroid) as any, coordinates as any)
    const distance = this.getDistance(centroid, turfPoint(coordinates))
    const translated = this.translate(geometry, distance, angle)
    return getCoords(translated as any)[0]
  }
}
