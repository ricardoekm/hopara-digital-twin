import {Row} from '@hopara/dataset'
import {PositionEncoding} from '@hopara/encoding'
import { Authorization } from '@hopara/authorization'
import ViewState from '../view-state/ViewState'
import { ZoomRange } from '../zoom/ZoomRange'
import { Coordinates, RowCoordinates } from '@hopara/spatial'

export const getTargetZoom = (viewState: ViewState, targetZoomRange?: ZoomRange, desiredZoom?: number): number | undefined => {
  if (targetZoomRange?.isInRange(viewState.zoom)) return
  return desiredZoom
}

export interface GetCoordinatesTransformProps {
  viewState: ViewState,
  row: Row,
  position: PositionEncoding,
  placeCoordinates: Coordinates,
  targetZoom?: number,
  authorization?: Authorization,
  referenceRow?: Row,
}

export interface Transform {
  field?: string
  getCoordinates: (props: GetCoordinatesTransformProps) => Promise<RowCoordinates>
}
