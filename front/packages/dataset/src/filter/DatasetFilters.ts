import {isEqual} from 'lodash/fp'
import { DatasetFilter } from './DatasetFilter'

export class DatasetFilters extends Array<DatasetFilter> {
  public push(item: DatasetFilter):number {
    const existingFilter = this.find((filter:DatasetFilter) => isEqual(filter, item))

    if (!existingFilter) {
      return super.push(item)
    }

    return this.length
  }
}
