import {GetCoordinatesTransformProps, Transform} from './Transform'
import { Coordinates, RowCoordinates } from '@hopara/spatial'

export const drawLineFromCentroid = (centroid:[number, number], size: number): [number, number][] => {
  const widthDelta = size / 2
  return [
    [centroid[0] - widthDelta, centroid[1]], // [left, center]
    [centroid[0] + widthDelta, centroid[1]], // [right, center]
  ]
}

export class LineTransform implements Transform {
  field: string

  constructor(field:string) {
    this.field = field
  }

  async getCoordinates({ viewState, placeCoordinates, targetZoom }: GetCoordinatesTransformProps): Promise<RowCoordinates> {
    if (!this.field) return new RowCoordinates()

    const geometry = drawLineFromCentroid([viewState.dimensions.width / 2, viewState.dimensions.height / 2], 100).map((coordinate) => {
      return viewState.unprojectCoordinate(Coordinates.fromArray(coordinate), targetZoom, placeCoordinates.toArray() as any)
    })
    return new RowCoordinates({geometry})
  }
}
