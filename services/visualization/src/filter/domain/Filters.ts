import { QueryKeys } from '../../data/QueryKeys.js'
import Filter from './Filter.js'

class Filters extends Array<Filter> {
  constructor(...filters: Filters | Filter[]) {
    super(...filters)
  }

  getQueryKeys(): QueryKeys {
    const queryKeys = this.map((item) => item.getQueryKey())
    return new QueryKeys(...queryKeys)
  }
}

export default Filters
