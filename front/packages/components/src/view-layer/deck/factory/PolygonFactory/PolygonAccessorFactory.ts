import {Row} from '@hopara/dataset'
import {lineAngle, lineMidpoint, pointRotate, pointTranslate} from 'geometric'
import { clamp } from 'lodash/fp'

function normalizeVector(v) {
  const length = Math.sqrt(v[0] ** 2 + v[1] ** 2)
  return [v[0] / length, v[1] / length]
}

function getAngle(prev: number, current: number, next: number): number {
  const v1 = [current[0] - prev[0], current[1] - prev[1]]
  const v2 = [next[0] - current[0], next[1] - current[1]]
  const normV1 = normalizeVector(v1)
  const normV2 = normalizeVector(v2)
  const dotProduct = normV1[0] * normV2[0] + normV1[1] * normV2[1]
  return Math.acos(dotProduct) * (180 / Math.PI)
}

function isConcavo(prev: number, current: number, next: number): boolean {
  const v1 = [current[0] - prev[0], current[1] - prev[1]]
  const v2 = [next[0] - current[0], next[1] - current[1]]
  return v1[0] * v2[1] - v1[1] * v2[0] > 0
}


function getAdjacentPoints(prev, current, next, radius) {
  const angle1 = lineAngle([current, prev])
  const angle2 = lineAngle([current, next])
  const newPoint1 = pointTranslate(current, angle1, radius)
  const newPoint2 = pointTranslate(current, angle2, radius)
  return [newPoint1, newPoint2]
}

function roundPolygonCorners(polygon, radius: number, points = 1) {
  const roundedPolygon = [] as any[]
  const internalPolygon = [...polygon]

  if (polygon.length && polygon[0][0] === polygon[polygon.length - 1][0] && polygon[0][1] === polygon[polygon.length - 1][1]) {
    internalPolygon.pop()
  }

  for (let i = 0; i < internalPolygon.length; i++) {
    const prev = internalPolygon[(i - 1 + internalPolygon.length) % internalPolygon.length]
    const current = internalPolygon[i]
    const next = internalPolygon[(i + 1) % internalPolygon.length]

    const line1Length = Math.sqrt((current[0] - prev[0]) ** 2 + (current[1] - prev[1]) ** 2)
    const line2Length = Math.sqrt((current[0] - next[0]) ** 2 + (current[1] - next[1]) ** 2)

    const localRadius = radius = clamp(0, Math.min(line1Length, line2Length) / 2, radius)

    const [newPoint1, newPoint2] = getAdjacentPoints(prev, current, next, localRadius)
    const midPoint = lineMidpoint([newPoint1, newPoint2])
    const origin = pointRotate(newPoint2, -90, midPoint)

    const angle = getAngle(prev, current, next)

    if (angle > 105 || angle < 75 || isConcavo(prev, current, next)) {
      roundedPolygon.push(current)
      continue
    }

    roundedPolygon.push(newPoint1)
    const step = angle / (points + 1)
    for (let j = points; j > 0; j--) {
      const currentAngle = step * j
      const point = pointRotate(newPoint2, currentAngle, origin)
      roundedPolygon.push(point)
    }
    roundedPolygon.push(newPoint2)
  }
  return [...roundedPolygon, roundedPolygon[0]]
}

export class PolygonAccessorFactory {
  static isGeometry(row) {
    return row.getCoordinates().isGeometryLike() && row.getCoordinates().getGeometryLike().length > 2
  }

  static create(borderRadius = 0) {
    return (row: Row) => {
      if (!this.isGeometry(row)) {
        return []
      }
      const geometry = row.getCoordinates().getGeometryLike(true)
      if ( borderRadius ) {
        return roundPolygonCorners(geometry, borderRadius, 10)
      }
      return geometry
    }
  }
}
