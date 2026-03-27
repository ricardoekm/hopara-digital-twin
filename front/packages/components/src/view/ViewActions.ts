import ViewState from '../view-state/ViewState'
import {createAction} from 'typesafe-actions'
import { AxesDimensions } from '../chart/domain/AxesDimension'
import { Projector } from '@hopara/projector'

interface ViewStatesPayload {
  interactionState?: {isDragging?: boolean, isZooming?:boolean, isPanning?:boolean}
  viewState?: ViewState,
  displacementDelta?: {x:number, y:number}
}

interface ViewLoadedPayload extends ViewStatesPayload {
  visualizationId: string,
}

interface ViewResizedPayload {
  viewState: ViewState
}

interface ViewZoomingPayload {
  direction: 'IN'| 'OUT',
  viewState: ViewState,
}

interface ChartCreatePayload {
  dimensions: AxesDimensions
  projector: Projector
}

interface ChartUpdatePayload {
  dimensions: AxesDimensions
  projector: Projector
}

export const actions = {
  viewLoaded: createAction('VIEW_LOADED')<ViewLoadedPayload>(),
  viewResized: createAction('VIEW_RESIZED')<ViewResizedPayload>(),
  viewZooming: createAction('VIEW_ZOOMING')<ViewZoomingPayload>(),
  viewDragStart: createAction('VIEW_DRAG_START')<{}>(),
  viewDragEnd: createAction('VIEW_DRAG_END')<ViewStatesPayload>(),
  chartCreated: createAction('VIEW_CHART_CREATED')<ChartCreatePayload>(),
  chartUpdated: createAction('VIEW_CHART_UPDATED')<ChartUpdatePayload>(),
}
