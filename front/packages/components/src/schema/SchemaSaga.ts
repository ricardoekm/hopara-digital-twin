import actions from '../state/Actions'
import {call, put, select, takeEvery} from '@redux-saga/core/effects'
import {getSchema} from './SchemaRepository'

export function* verifySchema() {
  const schema: any = yield select((store) => store.schema)
  if (Object.keys(schema).length === 0) {
    yield put(actions.schema.fetch.request())
  }
}

export function* fetchSchema(): any {
  try {
    const schema = yield call(getSchema)
    yield put(actions.schema.fetch.success(schema))
  } catch (e: any) {
    yield put(actions.schema.fetch.failure({
      exception: e,
    }))
  }
}

export const schemaSagas = () => [
  takeEvery(actions.settings.pageLoaded, verifySchema),
  takeEvery(actions.layerEditor.pageLoaded, verifySchema),
  takeEvery(actions.schema.fetch.request, fetchSchema),
]
