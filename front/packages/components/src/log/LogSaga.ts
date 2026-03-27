import actions, {ActionTypes} from '../state/Actions'
import {takeEvery} from '@redux-saga/core/effects'
import {Debug, Logger} from '@hopara/internals'
import {toastError} from '@hopara/design-system/src/toast/Toast'
import {i18n} from '@hopara/i18n'
import { getType } from 'typesafe-actions'

function formatErrorMessage(reason: string, exception: any) {
  if (reason) {
    return i18n(reason as any) || reason
  }
  if (exception?.message) {
    return exception.message
  }
}

function* handleError(action: ReturnType<
  typeof actions.log.genericError |
  typeof actions.visualization.fetch.failure |
  typeof actions.objectList.fetch.failure |
  typeof actions.filter.search.failure |
  typeof actions.query.fetch.failure |
  typeof actions.rowset.fetch.failure |
  typeof actions.rowset.rowSave.failure |
  typeof actions.schema.fetch.failure |
  typeof actions.visualization.save.failure |
  typeof actions.object.placeAtUserLocation.failure |
  typeof actions.image.history.failure |
  typeof actions.failure |
  typeof actions.model.upload.failure |
  typeof actions.image.upload.failure |
  typeof actions.image.crop.failure |
  typeof actions.fit.fitToImage.failure | 
  typeof actions.fit.fitToBuilding.failure 
>) {
  Logger.error(action.payload.exception)

  if ((action.payload as any).toast !== false) {
    toastError(formatErrorMessage((action.payload as any).reason, action.payload.exception))
  }
  yield
}

let lastTime = new Date()

const ignoredTypes = [
  getType(actions.viewLayer.mouseLeft),
  getType(actions.viewLayer.mouseHover),
  getType(actions.view.viewZooming),
  getType(actions.resource.downloadProgress),
  getType(actions.rowset.fetchDataProgress),
] as string[]

function* log(action: ActionTypes) {
  if (ignoredTypes.includes(action.type)) return
  if (Debug.isDebugging()) {
    const currentTime = new Date()
    Logger.debug('action interval', currentTime.getTime() - lastTime.getTime())
    lastTime = currentTime
    Logger.debug('action', action)
  }
  yield
}

export const logSagas = () => [
  takeEvery('*', log),
  takeEvery(actions.visualization.fetch.failure, handleError),
  takeEvery(actions.objectList.fetch.failure, handleError),
  takeEvery(actions.filter.search.failure, handleError),
  takeEvery(actions.query.fetch.failure, handleError),
  takeEvery(actions.rowset.fetch.failure, handleError),
  takeEvery(actions.image.history.failure, handleError),
  takeEvery(actions.rowset.rowSave.failure, handleError),
  takeEvery(actions.visualization.save.failure, handleError),
  takeEvery(actions.schema.fetch.failure, handleError),
  takeEvery(actions.model.upload.failure, handleError),
  takeEvery(actions.image.upload.failure, handleError),
  takeEvery(actions.object.placeAtUserLocation.failure, handleError),
  takeEvery(actions.image.crop.failure, handleError),
  takeEvery(actions.log.genericError, handleError),
  takeEvery(actions.fit.fitToImage.failure, handleError),
  takeEvery(actions.fit.fitToBuilding.failure, handleError),
]
