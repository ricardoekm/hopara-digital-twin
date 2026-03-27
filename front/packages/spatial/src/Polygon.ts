import {point as turfPoint, polygon as turfPolygon} from '@turf/helpers'
import turfBearing from '@turf/bearing'
import turfRewind from '@turf/rewind'
import { getCoords } from '@turf/invariant'

export const getPolygonBearing = (polygonLike: Array<Array<number>>): number => {
  const polygon = turfPolygon([polygonLike])
  const normalizedPolygon = turfRewind(polygon, {reverse: true})
  const coordinates = getCoords(normalizedPolygon)[0]
  const pointA = turfPoint(coordinates[0])
  const pointB = turfPoint(coordinates[1])
  return turfBearing(pointA, pointB)
}

export const sortPositions = (geometry: any, orthographic?: boolean): any => {
  const polygon = turfPolygon([geometry])
  const normalizedPolygon = turfRewind(polygon, {reverse: orthographic})
  return getCoords(normalizedPolygon)[0]
}
