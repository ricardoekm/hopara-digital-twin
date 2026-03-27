import { FetchState } from './FetchState'

export class SimpleFetchState implements FetchState {
  invalidated: boolean

  constructor(state: Partial<SimpleFetchState>) {
    this.invalidated = state?.invalidated || false
  }

  invalidate() {
    this.invalidated = true
  }

  isInvalidated(): boolean {
    return !!this.invalidated
  }

  shouldFetch() : boolean {
    if (this.invalidated) {
      return true
    }

    return false
  }

  clone() {
    return new SimpleFetchState(this)
  }
}
