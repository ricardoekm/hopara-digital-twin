import { Data } from '@hopara/encoding'
import {Rowset} from './Rowset'
import ViewState from '../view-state/ViewState'

export class Rowsets extends Array<Rowset> {
  hasRowset(rowsetId: string) : boolean {
    if (!rowsetId) return false
    return this.some((rowset:Rowset) => rowset.getId() === rowsetId)
  }

  getById(rowsetId: string) : Rowset | undefined {
    return this.find((rowset:Rowset) => rowset.getId() === rowsetId)
  }

  withData(data:Data) : Rowsets {
    const rowsets = this.filter((rowset:Rowset) => (rowset.data.query === data.query
                                                     && rowset.data.source === data.source) ||
                                                     (rowset.positionData.query === data.query
                                                      && rowset.positionData.source === data.source))
    return new Rowsets(...rowsets)
  }

  getEmptyList(): Rowsets {
    const rowsets = Object.values(this).filter((rowset: Rowset) => !rowset.rows)
    return new Rowsets(...rowsets)
  }

  getFetchAgainList(viewState: ViewState): Rowsets {
    const rowsets = Object.values(this).filter((rowset: Rowset) => {
      return rowset.fetchState && rowset.fetchState.shouldFetch(viewState)
    })
    return new Rowsets(...rowsets)
  }
}
