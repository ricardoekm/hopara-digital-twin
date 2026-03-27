import {call, put} from '@redux-saga/core/effects'
import actions from '../state/Actions'
import { getDevice, getGLState, getPlatformState } from '@hopara/browser'

function* getDeviceState() {
  const webgl = yield call(getGLState)
  const platform = getPlatformState()
  const device = yield call(getDevice)
  yield put(actions.browser.init({webgl, platform, device}))
}
import { takeAnyOnce } from '@hopara/state'

export const browserSagas = () => [
  takeAnyOnce([actions.visualization.pageLoaded, actions.settings.pageLoaded, actions.layerEditor.pageLoaded, actions.objectEditor.pageLoaded], getDeviceState),
]
