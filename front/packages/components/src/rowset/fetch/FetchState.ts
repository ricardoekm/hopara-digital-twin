import ViewState from '../../view-state/ViewState'

export interface FetchState {
  invalidate() : void
  isInvalidated() : boolean
  shouldFetch(viewState?:ViewState) : boolean
  clone() : FetchState
}
