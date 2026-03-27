import { FetchState } from './FetchState'
import { FetchStateFactory } from './FetchStateFactory'
import { SimpleFetchState } from './SimpleFetchState'

export class SimpleFetchStateFactory implements FetchStateFactory {
  create(): FetchState {
    return new SimpleFetchState({})
  }
}
