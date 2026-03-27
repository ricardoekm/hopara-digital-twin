import {GetCoordinatesTransformProps, Transform} from './Transform'
import { Coordinates, RowCoordinates, toPolygon } from '@hopara/spatial'
import { drawTargetGeometry } from './DrawGeometry'
import { Row } from '@hopara/dataset'
import ViewState from '../view-state/ViewState'
import { geometricFromViewport } from '../geometric/GeometricFactory'

export class PolygonTransform implements Transform {
  field: string

  constructor(field:string) {
    this.field = field
  }

  getGeometryFromReferenceRow(referenceRow: Row, viewState: ViewState, placeCoordinates: Coordinates): any {
    const geometry = referenceRow.getCoordinates().hasGeometry() ? referenceRow.getCoordinates().getGeometry() : []
    if (geometry.length !== 5) return
    const geometric = geometricFromViewport(viewState.viewport)
    const polygon = toPolygon(geometry)
    const translatedGeometry = geometric.translateToCoordinates(polygon, placeCoordinates.toArray())
    return translatedGeometry
  }

  async getCoordinates({viewState, targetZoom, placeCoordinates, referenceRow}: GetCoordinatesTransformProps): Promise<RowCoordinates> {
    if (!this.field) return new RowCoordinates()

    if (referenceRow) {
      const geometry = this.getGeometryFromReferenceRow(referenceRow, viewState, placeCoordinates)
      if (geometry) return RowCoordinates.fromGeometry(geometry)
    } 

    const targetGeometry = drawTargetGeometry([viewState.dimensions.width / 2, viewState.dimensions.height / 2])
    const geometry = targetGeometry.map((coordinate) => {
      return viewState.unprojectCoordinate(Coordinates.fromArray(coordinate), targetZoom, placeCoordinates.toArray() as any)
    })

    return new RowCoordinates({geometry})
  }
}
