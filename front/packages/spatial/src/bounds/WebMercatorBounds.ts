import {getCoords} from '@turf/invariant'
import getBearing from '@turf/bearing'
import {polygon as createPolygon, Feature, Polygon, point, featureCollection, Point, polygon as turfPolygon} from '@turf/helpers'
import {toMercator, toWgs84} from '@turf/projection'
import getCentroid from '@turf/centroid'
import transformRotate from '@turf/transform-rotate'
import nearestPoint from '@turf/nearest-point'
import rhumbDistance from '@turf/rhumb-distance'
import transformTranslate from '@turf/transform-translate'
import getBBox from '@turf/bbox'
import { getExtrudedBoundsGeometry, getExtrudedBoundsGeometryKeepingLargeSide } from './Extrude'
import { lineLength } from 'geometric'
import { BoundsOrientation } from '../Bounds'
import { BaseBounds } from './BaseBounds'

export class WebMercatorBounds extends BaseBounds {
  static fromGeometry(geometry: number[][]) {
    if ( !this.isArray(geometry) ) {
      return WebMercatorBounds.fromFeature(geometry)
    }

    const polygon = createPolygon([geometry])
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [minX, minY, _, maxY] = getBBox(polygon)

    const geometryFeature = featureCollection(geometry.map((coord) => point(coord)))    
    const bottomLeftPoint = nearestPoint([minX, minY], geometryFeature)
    const topLeftPoint = nearestPoint([minX, maxY], geometryFeature)

    const bearing = getBearing(bottomLeftPoint, topLeftPoint)
    const centroid = getCentroid(polygon)

    const rotatedPolygon = transformRotate(polygon, bearing * -1, {pivot: centroid})
    const [rMinX, rMinY, rMaxX, rMaxY] = getBBox(rotatedPolygon)
    const bboxPolygon = turfPolygon([[[rMinX, rMinY], [rMinX, rMaxY], [rMaxX, rMaxY], [rMaxX, rMinY], [rMinX, rMinY]]])
    const rotatedBBoxPolygon = transformRotate(bboxPolygon, bearing, {pivot: centroid})
    
    const bounds = getCoords(rotatedBBoxPolygon)[0].slice(0, 4)
    const boundsFeature = featureCollection<Point>(bounds.map((coord) => point(coord)))
    const zeroPoint = getCoords(nearestPoint(geometry[0], boundsFeature))
    const zeroPointIndex = bounds.findIndex((point) => point[0] === zeroPoint[0] && point[1] === zeroPoint[1])
    const orderedBounds = bounds.slice(zeroPointIndex, bounds.length).concat(bounds.slice(0, zeroPointIndex))

    return new WebMercatorBounds(...orderedBounds)
  }

  static fromFeature(polygon: Feature<Polygon>): WebMercatorBounds {
    return this.fromGeometry(getCoords(polygon)[0])
  }

  toPolygon() {
    return this.concat([this[0]])
  }

  toFeatureCollection() {
    return featureCollection([createPolygon([this.toPolygon()])])
  }

  getBearing() {
    return getBearing(this.getTopRight(), this.getTopLeft()) + 90
  }

  getAngle() {
    return this.getBearing()
  }

  getCentroid() {
    const centroid = getCentroid(createPolygon([this.toPolygon()]))
    return getCoords(centroid)
  }

  getWidth() {
    return rhumbDistance(this.getTopLeft(), this.getTopRight())
  }

  getHeight() {
    return rhumbDistance(this.getTopLeft(), this.getBottomLeft())
  }

  getRatio() {
    return this.getWidth() / this.getHeight()
  }

  getOrientation(): BoundsOrientation {
    const width = this.getWidth()
    const height = this.getHeight()

    if (width > height) {
      return BoundsOrientation.LANDSCAPE
    } else if (width < height) {
      return BoundsOrientation.PORTRAIT
    }

    return BoundsOrientation.SQUARE
  }

  getBoundingBox() {
    const geometry = this.toPolygon()
    const minX = Math.min(...geometry.map((position) => position[0]))
    const minY = Math.min(...geometry.map((position) => position[1]))
    const maxX = Math.max(...geometry.map((position) => position[0]))
    const maxY = Math.max(...geometry.map((position) => position[1]))
    return [[minX, minY], [maxX, maxY]]
  }

  rotateToBearing(targetBearing = 0): WebMercatorBounds {
    const boundsPolygon = createPolygon([this.toPolygon()])
    const rotatedPolygon = transformRotate(boundsPolygon, targetBearing - this.getBearing(), {pivot: this.getCentroid()})
    const rotatedCoords = getCoords(rotatedPolygon)[0]
    const plainBounds = rotatedCoords.slice(0, 4)

    return new WebMercatorBounds(...plainBounds)
  }

  extrudeGeometry(refWidth: number, refHeight: number, forceWidth = true) {
    const normalized = this.rotateToBearing(0)
    const mercatorPolygon = toMercator(createPolygon([normalized.toPolygon()]))
    const mercatorBounds = new WebMercatorBounds(...getCoords(mercatorPolygon)[0])
    const extrudedBounds = forceWidth ?
                           getExtrudedBoundsGeometry(mercatorBounds, refWidth, refHeight) :
                           getExtrudedBoundsGeometryKeepingLargeSide(mercatorBounds, refWidth, refHeight)

    const wsg84Rect = toWgs84(createPolygon([extrudedBounds]))
    const newCentroid = getCentroid(wsg84Rect)
    const translateToCentroid = transformTranslate(wsg84Rect, rhumbDistance(newCentroid, this.getCentroid()), getBearing(newCentroid, this.getCentroid()))
    const rotatedGeoJSONPolygon = transformRotate(translateToCentroid, this.getBearing())
    const rotatedCoords = getCoords(rotatedGeoJSONPolygon)[0]
    const plainBounds = rotatedCoords.slice(0, 4)
    
    return new WebMercatorBounds(...plainBounds)
  }

  scaleToRatio(targetRatio?: number): WebMercatorBounds {
    if (!targetRatio) return this

    const normalized = this.rotateToBearing(0)
    const mercatorPolygon = toMercator(createPolygon([normalized.toPolygon()]))
    const mercatorCoords = getCoords(mercatorPolygon)[0]
    const mercatorCentroid = getCentroid(mercatorPolygon)
    const mercatorCentroidCoords = getCoords(mercatorCentroid)
    const width = lineLength([mercatorCoords[1], mercatorCoords[2]])
    const height = lineLength([mercatorCoords[1], mercatorCoords[0]])
    const ratio = width / height

    const newWidth = ratio > targetRatio ? height * targetRatio : width
    const newHeight = ratio > targetRatio ? height : width / targetRatio
    const minX = mercatorCentroidCoords[0] - (newWidth / 2)
    const minY = mercatorCentroidCoords[1] - (newHeight / 2)
    const maxX = mercatorCentroidCoords[0] + (newWidth / 2)
    const maxY = mercatorCentroidCoords[1] + (newHeight / 2)

    const scaledBoundsPolygon = createPolygon([[[minX, minY], [minX, maxY], [maxX, maxY], [maxX, minY], [minX, minY]]])
    const wsg84Rect = toWgs84(scaledBoundsPolygon)
    const rotatedGeoJSONPolygon = transformRotate(wsg84Rect, this.getBearing())
    const rotatedCoords = getCoords(rotatedGeoJSONPolygon)[0]

    const bounds = rotatedCoords.slice(0, 4)
    const boundsFeature = featureCollection<Point>(bounds.map((coord) => point(coord)))
    const zeroPoint = getCoords(nearestPoint(this.getBottomLeft(), boundsFeature))
    const zeroPointIndex = bounds.findIndex((point) => point[0] === zeroPoint[0] && point[1] === zeroPoint[1])
    const orderedBounds = bounds.slice(zeroPointIndex, bounds.length).concat(bounds.slice(0, zeroPointIndex))

    return new WebMercatorBounds(...orderedBounds)
  }

  fixOrientation(referenceBounds: WebMercatorBounds): WebMercatorBounds {
    const orientation = this.getOrientation()
    const referenceOrientation = referenceBounds.getOrientation()
    if (orientation === referenceOrientation) {
      return this
    }
    
    // reordering the points to rotate the bounds and make it match the reference orientation
    const newBounds = this.getBearing() >= 0 ?
      [this.getTopLeft(), this.getTopRight(), this.getBottomRight(), this.getBottomLeft()] :
      [this.getBottomRight(), this.getBottomLeft(), this.getTopLeft(), this.getTopRight()]
    
    return new WebMercatorBounds(...newBounds)
  }

  rotateGeometry(geometry: number[][], reverse = false): number[][] {
    const polygon = createPolygon([geometry])
    const rotatedPolygon = transformRotate(polygon, reverse ? this.getBearing() * -1 : this.getBearing(), {pivot: this.getCentroid()})
    return getCoords(rotatedPolygon)[0]
  }
}
