import { Row, Rows } from '@hopara/dataset'
import {lineLength} from 'geometric'
import {deepMax} from '../../../../sets/Max'
import distance from '@turf/distance'

interface TimelineData {
  durationMs: number,
  timestampFn: (row: Row) => [number, number][] | undefined
}


const getRowDistances = (row: Row, isGeo: boolean): number[] | undefined => {
  const route = row.getCoordinates().isGeometryLike() ? row.getCoordinates().getGeometryLike() : undefined
  const distances = route?.map((_, index) => {
    const point1 = route[index]
    const point2 = route[index + 1]
    if (!point2) {
      return
    }
    if (isGeo) {
      return distance(point1, point2, {units: 'kilometers'})
    }
    return lineLength([point1, point2])
  }).filter((distance) => !!distance) as number[]
  let accDistance = 0
  return distances?.map((distance) => {
    accDistance += distance
    return accDistance
  })
}

const getDurationMs = (distanceMeters: number, speedMPerSecond: number) => {
  return 1000 * (distanceMeters / (speedMPerSecond / 1000))
}

export const getTimelineData = (data: Rows, speedMPerSecond: number, isGeo: boolean): TimelineData => {
  const allDistances = data.map((row) => {
    return getRowDistances(row, isGeo)
  })

  const maxDistance = deepMax(allDistances)
  const durationMs = speedMPerSecond === 0 ? 0 : getDurationMs(maxDistance, speedMPerSecond)

  return {
    durationMs,
    timestampFn: (row: Row) => {
      const distances = getRowDistances(row, isGeo)
      const durations = [0, ...(distances?.map((distance) => {
        return getDurationMs(distance, speedMPerSecond)
      })) ?? []]
      const ret:Array<[number, number]> = []
      if ( distances ) {
        for (let i = 0; i < distances.length; i++) {
          ret.push([durations[i], durations[i + 1]])
        }
      }
      return ret
    },
  }
}
