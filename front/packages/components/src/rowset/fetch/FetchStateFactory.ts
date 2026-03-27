import { Box } from '@hopara/spatial'
import { FetchState } from './FetchState'

export const FetchStateFactoryToken = Symbol('FetchStateFactory')

export interface FetchStateFactory {
  create(fetchBox?:Box) : FetchState
}
