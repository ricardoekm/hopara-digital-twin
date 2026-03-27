import {call, put, select, takeEvery} from '@redux-saga/core/effects'
import actions from '../state/Actions'
import { Store } from '../state/Store'
import { Layer } from '../layer/Layer'
import { Row } from '@hopara/dataset'
import { Action, ActionType, ZoomJump } from './Action'
import { URLStringTemplate } from '../tooltip/domain/URLStringTemplate'
import { createJumpFilters } from '../jump/JumpFilters'
import { createJumpUrl } from '../jump/Jump'
import { Coordinates } from '@hopara/spatial'
import { PageNavigation } from '@hopara/page/src/PageNavigation'
import { RowProjector } from '@hopara/projector'

function* triggerCallback(action: ReturnType<typeof actions.action.functionCallback>) {
  const callbacks = yield select((store: Store) => store.action.registeredCallbacks)
  const callback = callbacks?.find((callback) => callback.name === action.payload.name)
  if (!callback) return

  yield call(callback.callback, {row: action.payload.row, pixel: action.payload.pixel})
}

function* actionVisualizationChanged(action: ReturnType<typeof actions.action.visualizationChanged>) {
  yield put(actions.visualization.listFilters.request({visualizationId: action.payload.visualization}))
}

function* dispatchAction({action, coordinates, row, layer, tenant, navigation, pixel}: {
  action: Action, coordinates?: Coordinates, row?: Row, layer?: Layer, 
  tenant: string, navigation: PageNavigation,
  pixel?: Coordinates
}) {
  switch (action.type) {
    case ActionType.ZOOM_JUMP:
      if (!coordinates || !layer) return
      return yield put(actions.details.zoomRequested({
        row,
        coordinates,
        layer,
        navigate: action as ZoomJump,
      }))
    case ActionType.FUNCTION_CALLBACK:
      return yield put(actions.action.functionCallback({
        name: action.name,
        row: row!,
        rowsetId: layer?.getRowsetId(),
        layerId: layer?.getId(),
        pixel,
      }))
    case ActionType.EXTERNAL_LINK_JUMP: {
      const urlStringTemple = new URLStringTemplate(action.href)
      const formattedHref = urlStringTemple.getCompiledValue(row)
      return window.open(formattedHref, action.target ?? '_top')
    }
    case ActionType.VISUALIZATION_JUMP: {
      const filters = createJumpFilters(action, row)
      const jumpUrl = createJumpUrl(action, tenant, filters)
      const routeParams = navigation.getRouteParams()
      return navigation.urlNavigate(jumpUrl, {replace: false, state: {routeParams}})
    }
  }
}

function* triggerAction(ac: ReturnType< typeof actions.action.objectActionTriggered | typeof actions.details.actionClicked >) {
  const layer: Layer = yield select((store: Store) => store.layerStore.layers.getById(ac.payload.layerId)!)
  const tenant = yield select((store: Store) => store.auth.authorization.tenant)
  const chartProjector: RowProjector = yield select((store: Store) => store.chart.projector ? new RowProjector(store.chart.projector) : undefined)

  const action = ac.payload.action
  let row = ac.payload.row
  if ( row && chartProjector) {
    row = chartProjector.project(row)
  }

  yield dispatchAction({
    action,
    coordinates: row?.getCoordinates().toCoordinates(),
    row,
    layer,
    tenant,
    navigation: ac.payload.navigation,
    pixel: (ac.payload as any).pixel,
  })
}

function* triggerNavigationAction({payload}: ReturnType<typeof actions.navigation.actionClicked>) {
  const tenant = yield select((store: Store) => store.auth.authorization.tenant)
  const action = payload.action

  yield dispatchAction({
    action,
    tenant,
    navigation: payload.navigation,
  })
}

export const actionSagas = () => [
  takeEvery(actions.action.objectActionTriggered, triggerAction),
  takeEvery(actions.details.actionClicked, triggerAction),
  takeEvery(actions.navigation.actionClicked, triggerNavigationAction),
  takeEvery(actions.action.functionCallback, triggerCallback),
  takeEvery(actions.action.visualizationChanged, actionVisualizationChanged),
]
