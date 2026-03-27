import Filter from './Filter.js'
import Filters from './Filters.js'
import { FilterSpec } from './spec/Filter.js'

export class FiltersFactory {
  static fromSpec(specs: FilterSpec[]): Filters {
    return new Filters(...specs.map((spec) => {
      return new Filter(spec)
    }))  
  }
}
