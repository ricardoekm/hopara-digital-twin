import {call, put, select, takeLatest} from '@redux-saga/core/effects'
import actions from '../../state/Actions'
import * as VisualizationService from '../VisualizationService'
import {Authorization} from '@hopara/authorization'

import {toastError, toastSuccess} from '@hopara/design-system/src/toast/Toast'
import Visualization from '../Visualization'
import {Store} from '../../state/Store'

import {HttpError} from '@hopara/http-client'
import {VisualizationStore} from './VisualizationStore'
import ViewState from '../../view-state/ViewState'
import {Layers} from '../../layer/Layers'
import {Filters} from '../../filter/domain/Filters'
import {Legends} from '../../legend/Legends'
import { getRefreshAuthorization } from '../../auth/AuthSaga'
import {Floors} from '../../floor/Floors'
import { Grid } from '../../grid/Grid'

const getVisualization = (store: Store): Visualization | undefined => store.visualizationStore.visualization

export function* saveVisualizationRequest() {
  const authorization: Authorization = yield getRefreshAuthorization()
  const visualization: Visualization | undefined = yield select(getVisualization)
  const visualizationStore: VisualizationStore = yield select((state) => state.visualizationStore)
  const viewState: ViewState = yield select((store: Store) => store.viewState)
  const layers: Layers = yield select((store: Store) => store.layerStore.layers)
  const filters: Filters = yield select((store: Store) => store.filterStore.filters)
  const legends: Legends = yield select((store: Store) => store.legends)
  const floors: Floors = yield select((store: Store) => store.floorStore.visualizationFloors)
  const grids: Grid[] = yield select((store:Store) => store.grid)

  if (!visualization) return

  try {
    yield call(VisualizationService.saveVisualization,
      visualizationStore.visualization?.id as string,
      visualization,
      viewState,
      layers,
      filters,
      legends,
      floors,
      grids,
      authorization,
    )
    yield put(actions.visualization.save.success())
  } catch (e: any) {
    yield put(actions.visualization.save.failure({exception: e}))
  }
}

// eslint-disable-next-line require-yield
export function* saveVisualizationSuccess() {
  toastSuccess('Visualization saved successfully.')
}

const formatErrorMessage = (exception?: HttpError): string => {
  if (!exception) return ''
  if (Array.isArray(exception.cause) && exception.cause.length) {
    const firstErrorMessage = `${exception.cause[0].instancePath}:\n ${exception.cause[0].message}`
    if (exception.cause.length > 1) return `${firstErrorMessage}\n and other ${exception.cause.length - 1} errors...`
    return firstErrorMessage
  }
  return exception.message ?? ''
}

// eslint-disable-next-line require-yield
export function* saveVisualizationFailure(action: ReturnType<typeof actions.visualization.save.failure>) {
  const exceptionMessage = formatErrorMessage(action.payload.exception)
  toastError('Visualization could not be saved.\n' + exceptionMessage)
}

function* loadVisualizationFilters(action: ReturnType<typeof actions.visualization.listFilters.request>) {
  const authorization: Authorization = yield getRefreshAuthorization()
  try {
    const filters = yield call(VisualizationService.listFilters, action.payload.visualizationId, authorization)
    yield put(actions.visualization.listFilters.success({filters}))
  } catch (e: any) {
    yield put(actions.visualization.listFilters.failure({exception: e}))
  }
}

export const visualizationSagas = () => [
  takeLatest(actions.visualization.save.failure, saveVisualizationFailure),
  takeLatest(actions.visualization.save.request, saveVisualizationRequest),
  takeLatest(actions.visualization.save.success, saveVisualizationSuccess),
  takeLatest(actions.visualization.listFilters.request, loadVisualizationFilters),
]
