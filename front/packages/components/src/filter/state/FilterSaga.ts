import {call, debounce, put, select, takeEvery} from '@redux-saga/core/effects'
import {Authorization} from '@hopara/authorization'
import {fetchValues, FilterRepository} from '../FilterRepository'
import actions from '../../state/Actions'
import {Store} from '../../state/Store'
import Visualization from '../../visualization/Visualization'
import {plainToInstance} from 'class-transformer'
import {Filter} from '../domain/Filter'
import { getRefreshAuthorization } from '../../auth/AuthSaga'

export function* fetchFilterSuggestions(action: ReturnType<
  typeof actions.filter.searchChanged
>) {
  const authorization: Authorization = yield getRefreshAuthorization()

  if (!action.payload.term) {
    yield put(actions.filter.search.success({data: action.payload.data, field: action.payload.field, values: []}))
    return
  }

  try {
    const searchResults = yield call(
      fetchValues,
      action.payload.data,
      action.payload.field,
      action.payload.term,
      [],
      authorization,
    )
    yield put(actions.filter.search.success({data: action.payload.data, field: action.payload.field, values: searchResults}))
  } catch (e: any) {
    yield put(actions.filter.search.failure({exception: e}))
  }
  return
}

export function* reloadFilter(action: any) {
  const authorization: Authorization = yield getRefreshAuthorization()
  let filter: Filter | undefined = undefined
  if (action.payload.id) {
    filter = yield select((state: Store) => state.filterStore.filters.getById(action.payload.id))
  } else if (action.payload.rowsetId) {
    const rowset = yield select((state: Store) => state.rowsetStore.rowsets[action.payload.rowsetId])
    filter = yield select((state: Store) => state.filterStore.filters.getByData(rowset?.getData()))
  }

  if (!filter) { 
    return
  }

  try {
    const values = yield call(
      fetchValues,
      filter.data,
      filter.field,
      undefined,
      [],
      authorization,
    )
    yield put(actions.filter.loadValues.success({id: filter.id, values}))
  } catch (e: any) {
    yield put(actions.filter.loadValues.failure({exception: e}))
  }
}


export function* createFilter() {
  const authorization: Authorization = yield getRefreshAuthorization()
  const visualization: Visualization | undefined = yield select((store: Store): Visualization | undefined => store.visualizationStore.visualization)

  try {
    const data = yield call(FilterRepository.create, authorization)
    data.visualization = visualization?.id
    const filter = plainToInstance(Filter, data) as Filter
    yield put(actions.filter.create.success({filter}))
    yield put(actions.filter.selected(filter))
  } catch (error: any) {
    yield put(actions.filter.create.failure({exception: error}))
  }
}


export const filterSagas = () => [
  takeEvery(actions.filter.fieldChanged, reloadFilter),
  takeEvery(actions.filter.changed, reloadFilter),
  takeEvery(actions.object.create.success, reloadFilter),
  takeEvery(actions.object.delete.success, reloadFilter),
  debounce(300, actions.filter.searchChanged, fetchFilterSuggestions),
  takeEvery(actions.filter.create.request, createFilter),
]
