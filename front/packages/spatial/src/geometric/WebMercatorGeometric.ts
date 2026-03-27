import {Feature, FeatureCollection, LineString, Point, Polygon, Properties, polygon as turfPolygon, point as turfPoint, BBox} from '@turf/helpers'
import bboxPolygon from '@turf/bbox-polygon'
import bbox from '@turf/bbox'
import turfBearing from '@turf/bearing'
import turfCentroid from '@turf/centroid'
import {getCoord, getCoords} from '@turf/invariant'
import turfTransformRotate from '@turf/transform-rotate'
import turfDistance from '@turf/distance'
import {Geometric} from './Geometric'
import turfMidpoint from '@turf/midpoint'
import { polygonScaleX, polygonScaleY } from 'geometric'
import { polygonToLine } from '@turf/polygon-to-line'
import transformTranslate from '@turf/transform-translate'

export class WebMercatorGeometric implements Geometric {
  getBounds(geometry: Feature<Polygon | LineString>) {
    return bbox(geometry)
  }

  getBBox(geometry: Feature<Polygon | LineString>) {
    return bboxPolygon(this.getBounds(geometry))
  }

  getRotatedBBox(geometry: FeatureCollection) {
    const coords = getCoords(geometry.features[0].geometry as any)
    const angle = Array.isArray(coords[0][0]) ? turfBearing(coords[0][0], coords[0][1]) : 0
    const normalized = turfTransformRotate(geometry as any, -angle)
    const centroid = turfCentroid(geometry as any)
    const boundingBox = bboxPolygon(bbox(normalized))
    return polygonToLine(this.polygonRotate(boundingBox, angle, centroid)) as Feature<LineString>
  }

  getNormalizedBBox(polygon: Feature<Polygon>) {
    const coords = getCoords(polygon.geometry)
    const angle = Array.isArray(coords[0][0]) ? turfBearing(coords[0][0], coords[0][1]) : 0
    const centroid = turfCentroid(polygon.geometry)
    const normalized = this.polygonRotate(polygon, -angle, centroid)
    return bbox(normalized) as BBox
  }

  getCentroid(geometry: FeatureCollection | Feature) {
    return turfCentroid(geometry as any)
  }

  getScaleFactor(centroid: Point, startDragPoint: Point, currentPoint: Point) {
    const startDistance = turfDistance(centroid, startDragPoint)
    const endDistance = turfDistance(centroid, currentPoint)
    return endDistance / startDistance
  }

  polygonRotate(geometry: Feature<Polygon>, angle: number, centroid: Feature<Point>) {
    return turfTransformRotate(geometry, angle, {pivot: centroid})
  }

  getMidPoint(point1: Point, point2: Point) {
    return turfMidpoint(point1, point2)
  }

  getTopMidPoint(geometry: Feature<Polygon>) {
    const coords = getCoords(geometry)[0]
    return this.getMidPoint(coords[2], coords[3])
  }

  getLineBearing(point1: Point, point2: Point) {
    return turfBearing(getCoord(point1), getCoord(point2))
  }

  getBearing(coordinate: Feature<Polygon>) {
    const coords = getCoords(coordinate)
    return this.getLineBearing(coords[0][0], coords[0][1])
  }

  getDistance(point1: Feature<Point, Properties>, point2: Feature<Point, Properties>): number {
    return turfDistance(point1, point2)
  }

  lineRotate(line: Feature<LineString>, angle: number, pivot: Feature<Point>): Feature<LineString> {
    const pivot_ = getCoord(pivot)
    return turfTransformRotate(line, angle, {pivot: pivot_})
  }

  scalePolygon(polygon: Feature<Polygon>, scaleFactor: number, pivot: Feature<Point>, originIndex: number) {
    if ((originIndex === 0 || originIndex === 2)) {
      return turfPolygon([polygonScaleY(getCoords(polygon as any)[0], scaleFactor, getCoord(pivot) as any)])
    }
    return turfPolygon([polygonScaleX(getCoords(polygon as any)[0], scaleFactor, getCoord(pivot) as any)])
  }

  translate(geometry: Feature<Polygon>, distance: number, angle: number): Feature {
    return transformTranslate(geometry, distance, angle)
  }

  translateToCoordinates(geometry: Feature<Polygon>, coordinates: number[]): number[] {
    const centroid = this.getCentroid(geometry)
    const angle = this.getLineBearing(getCoords(centroid) as any, coordinates as any)
    const distance = this.getDistance(centroid, turfPoint(coordinates))
    const translated = this.translate(geometry, distance, angle)
    return getCoords(translated as any)[0]
  }
}


