import { Query } from '../query/Query'
import { DataLoader } from './DataLoader'

export class DataLoaders extends Array<DataLoader> {
  getLoader(query?: Query): DataLoader | undefined {
    if (!query) return undefined
    return this.find((loader) => loader.isFromQuery(query))
  }

  clone() {
    return new DataLoaders(...this)
  }
}
