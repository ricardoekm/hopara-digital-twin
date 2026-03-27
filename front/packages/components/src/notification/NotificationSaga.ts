import {NotificationListener, NotificationType} from './NotificationListener'
import actions from '../state/Actions'
import {Authorization} from '@hopara/authorization'
import {select} from '@redux-saga/core/effects'
import {Store} from '../state/Store'
import Visualization from '../visualization/Visualization'
import { takeOnce } from '@hopara/state'
import { getRefreshAuthorization } from '../auth/AuthSaga'

const getVisualization = (store: Store) => store.visualizationStore.visualization

export function* sinscribe() {
  const notificationListener = NotificationListener.getInstance()
  const authorization: Authorization = yield getRefreshAuthorization()
  const visualization: Visualization = yield select(getVisualization)

  notificationListener.subscribe(NotificationType.VISUALIZATION_CHANGE, authorization.tenant as string, visualization.id)
  notificationListener.subscribe(NotificationType.POSITION_CHANGE, authorization.tenant as string)
  notificationListener.subscribe(NotificationType.GENERATE_PROGRESS, authorization.tenant as string)
  notificationListener.subscribe(NotificationType.ROW_CHANGE, authorization.tenant as string)
  notificationListener.subscribe(NotificationType.MODEL_PROCESSED, authorization.tenant as string)
  notificationListener.subscribe(NotificationType.QUERY_CHANGE, authorization.tenant as string)
}

export const notificationSagas = () => [
  takeOnce(actions.visualization.fetch.success, sinscribe),
]
