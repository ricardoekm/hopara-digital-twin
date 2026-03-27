import { Data } from '@hopara/encoding'
import { SearchFilter } from './SearchFilter'

export class SearchFilters extends Array<SearchFilter> {
  clone(): SearchFilters {
    return new SearchFilters(...this)
  }

  getByDataAndField(data: Data, field: string): SearchFilter | undefined { 
    return this.find((filter) => filter.data.isEqual(data) && filter.field === field)
  }

  setFilterTerm(data: Data, field: string, term: string | undefined, values: any[]): SearchFilters {
    const cloned = this.clone()

    const searchFilter = this.getByDataAndField(data, field)
    if (!searchFilter) {
      cloned.push(new SearchFilter({data, field, term, values}))
    } else if (!searchFilter.term) {
      cloned.splice(cloned.indexOf(searchFilter), 1, searchFilter.setTerm(term).setValues(values))
    } else {
      cloned.splice(cloned.indexOf(searchFilter), 1, searchFilter.setTerm(term))
    }
    return cloned
  }

  setFilterValues(data: Data, field: string, values: any[]): SearchFilters {
    const cloned = this.clone()

    const filter = this.getByDataAndField(data, field)
    if (!filter) {
      cloned.push(new SearchFilter({data, field, values}))
      return cloned
    }

    cloned.splice(cloned.indexOf(filter), 1, filter.setValues(values))
    return cloned
  }
}
