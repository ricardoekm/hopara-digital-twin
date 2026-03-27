import { FetchController, Prefetch } from './FetchController'
import { differenceBy, intersectionBy, uniqBy, unionWith, isEqual } from 'lodash/fp'
import { Layers } from '../../layer/Layers'
import { Rowset } from '../Rowset'
import { Rowsets } from '../Rowsets'
import ViewState from '../../view-state/ViewState'

export class SimpleFetchController implements FetchController {
  getFetchBox() {
    return undefined
  }

  getPrefetchs() : Prefetch[] {
    return []
  }

  getRowsetsToFetch(layers:Layers, rowsets:Rowsets, viewState:ViewState) : Rowsets {
    const candidateRowsets = layers.getUniqueRowsets()
    const nonexistent = differenceBy((r: Rowset) => r.getId(), candidateRowsets, rowsets)
    const empty = intersectionBy((r: Rowset) => r.getId(), candidateRowsets, rowsets.getEmptyList())
    const newData = uniqBy((r: Rowset) => r.getId(), unionWith(isEqual, nonexistent, empty))

    const fetchAgainData = intersectionBy((r: Rowset) => r.getId(), candidateRowsets, rowsets.getFetchAgainList(viewState))
    const rowsetsToFetch = uniqBy((r: Rowset) => r.getId(), unionWith(isEqual, fetchAgainData, newData))
    return new Rowsets(...rowsetsToFetch)
  }
}
