import {GetCoordinatesTransformProps, Transform} from './Transform'
import { RowCoordinates } from '@hopara/spatial'

export class DefaultTransform implements Transform {
  async getCoordinates({viewState, position, placeCoordinates}: GetCoordinatesTransformProps): Promise<RowCoordinates> {
    const x = placeCoordinates.x
    const y = placeCoordinates.y

    if (position.z) {
      return new RowCoordinates({x, y, z: placeCoordinates.z ?? viewState.getCoordinates().z ?? 0})
    }

    return new RowCoordinates({x, y})
  }
}
