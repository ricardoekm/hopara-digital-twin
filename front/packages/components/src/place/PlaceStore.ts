import { PlaceSuggenstion } from './PlaceSearchRepository'

export enum PlaceStoreStatus {
  NONE = 'NONE',
  LOADING = 'LOADING',
}

export class PlaceStore {
  places: PlaceSuggenstion[]
  status: PlaceStoreStatus

  constructor(props: Partial<PlaceStore> = {}) {
    Object.assign(this, props)
    if (!this.places) this.places = []
    if (!this.status) this.status = PlaceStoreStatus.NONE
  }

  setPlaces(places: PlaceSuggenstion[]) {
    return new PlaceStore({...this, places})
  }

  setStatus(status: PlaceStoreStatus) {
    return new PlaceStore({...this, status})
  }

  isLoading() {
    return this.status === PlaceStoreStatus.LOADING
  }
}
