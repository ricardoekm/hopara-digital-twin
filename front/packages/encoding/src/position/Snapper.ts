import { Coordinates } from '@hopara/spatial'

export class Snapper {
  threshold: number

  constructor(threshold:number) {
    this.threshold = threshold
  }

  distance(coordinates1: Coordinates, coordinates2: Coordinates) {
    return Math.hypot(coordinates1.x - coordinates2.x, 
                      coordinates1.y - coordinates2.y,
                      coordinates1.z - coordinates2.z)
  }

  sortByDistance(coordinates: Coordinates, coordinatesList:Coordinates[]) {
    return coordinatesList.filter((c) => !c.equals(coordinates))
                          .sort((a, b) => this.distance(a, coordinates) - this.distance(b, coordinates))
  }

  snap(coordinates: Coordinates, coordinatesList:Coordinates[]) {
    const snapCandidate = this.sortByDistance(coordinates, coordinatesList)[0]
    if (!snapCandidate) {
      return undefined
    } 

    const deltaX = Math.abs(coordinates.x - snapCandidate.x)
    const deltaY = Math.abs(coordinates.y - snapCandidate.y)
    const deltaZ = Math.abs(coordinates.z - snapCandidate.z)

    const snapX = deltaX > 0 && deltaX <= this.threshold
    const snapY = deltaY > 0 && deltaY <= this.threshold
    const snapZ = deltaZ > 0 && deltaZ <= this.threshold

    if (snapX || snapY || snapZ) {
      return {
        coordinates: new Coordinates({
          x: snapX ? snapCandidate.x : coordinates.x,
          y: snapY ? snapCandidate.y : coordinates.y,
          z: snapZ ? snapCandidate.z : coordinates.z,
        }),
        reference: snapCandidate,
      }
    }

    return undefined
  }
}
