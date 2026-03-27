import {getType} from 'typesafe-actions'
import actions, {ActionTypes} from '../state/Actions'
import QueryStore from './QueryStore'
import { Reducer } from '@hopara/state'

export const queryReducer: Reducer<QueryStore, ActionTypes> = (queryStore, action, globalState) => {
  if (!queryStore) {
    return new QueryStore({loaders: globalState?.queryStore?.loaders})
  }

  switch (action.type) {
    case getType(actions.visualization.routeChanged):
      return new QueryStore({...queryStore, queries: undefined})
    case getType(actions.visualization.fetch.success):
    case getType(actions.visualization.refreshed):
      return queryStore.setQueries(action.payload.queries)
    case getType(actions.query.fetch.success):
      return queryStore.setQueries(action.payload.queries)
    case getType(actions.layer.toHoparaManaged.success): {
      return queryStore.addQueries(action.payload.queries)
    }
    case getType(actions.hoc.init):
    case getType(actions.hoc.visualizationChanged):
      return new QueryStore().setLoaders(action.payload.dataLoaders ?? [])
    case getType(actions.hoc.loaderChanged):
      return queryStore.setLoaders(action.payload.dataLoaders ?? [])
    case getType(actions.query.mergedWithRowset):
      return queryStore.setQuery(action.payload.query)
    default:
      return queryStore
  }
}
