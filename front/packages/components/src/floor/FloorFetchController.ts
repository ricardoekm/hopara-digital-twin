import { isEmpty } from 'lodash/fp'
import { Layers } from '../layer/Layers'
import { Rowsets } from '../rowset/Rowsets'
import ViewState from '../view-state/ViewState'
import { Rowset } from '../rowset/Rowset'
import { FetchController, FetchControllerToken } from '../rowset/fetch/FetchController'
import {container} from 'tsyringe'

export function getFloorsFetchData(layers: Layers, rowsets: Rowsets, viewState: ViewState) {
  const floorLayers = layers.getWithFloor()
  if (isEmpty(floorLayers)) {
    return []
  }

  const fetchController = container.resolve<FetchController>(FetchControllerToken)
  const rowsetsToFetch = fetchController.getRowsetsToFetch(floorLayers, rowsets, viewState)
  if (rowsetsToFetch.length) {
    return rowsetsToFetch.map((rowset) => ({rowset: rowset as Rowset, viewState}))
  }

  const prefetchs = fetchController.getPrefetchs(floorLayers, rowsets, viewState)
  return prefetchs.map((prefetch) => ({rowset: prefetch.rowset as Rowset, viewState: prefetch.targetViewState}))
}
