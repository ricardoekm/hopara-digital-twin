import { Data } from '@hopara/encoding'
import { Filter } from '../domain/Filter'
import {Filters} from '../domain/Filters'
import { SearchFilters } from '../domain/SearchFilters'
import { SelectedFilters } from '../domain/SelectedFilters'
import { uniqBy } from 'lodash/fp'
import { SelectedFilter } from '../domain/SelectedFilter'

export class FilterStore {
  filters: Filters
  selectedFilters: SelectedFilters
  searchFilters: SearchFilters
  editingId?: string
  isAdvancedMode: boolean
  activated: boolean

  constructor(props?: Partial<FilterStore>) {
    Object.assign(this, props)
    this.filters = this.filters ?? new Filters()
    this.selectedFilters = this.selectedFilters ?? new SelectedFilters()
    this.searchFilters = this.searchFilters ?? new SearchFilters()
    this.activated = !!this.activated
  }

  clone(): FilterStore {
    return new FilterStore(this)
  }

  setActivated(activated: boolean): FilterStore {
    const cloned = this.clone()
    cloned.activated = activated
    return cloned
  }

  setFilters(filters: Filters): FilterStore {
    const cloned = this.clone()
    cloned.filters = filters
    return cloned
  }

  moveFilter(filterId: string, steps: number): FilterStore {
    return this.setFilters(this.filters.move(filterId, steps))
  }

  deleteFilter(filterId: string): FilterStore {
    return this.setFilters(this.filters.delete(filterId))
  }

  upsertFilter(filter: Filter): FilterStore {
    return this.setFilters(this.filters.upsert(filter))
  }

  setEditing(filterId?: string): FilterStore {
    const cloned = this.clone()
    cloned.editingId = filterId
    return cloned
  }

  setFilterAttribute(filterId: string | undefined, attributes: Partial<Filter>): FilterStore {
    return this.setFilters(this.filters.immutableSet(filterId, attributes))
  }

  setFilterValues(filterId: string, values: any[]): FilterStore {
    const cloned = this.clone()
    cloned.filters = cloned.filters.setFilterValues(filterId, values)
    return cloned
  }

  setSelectedFilters(selectedFilters: SelectedFilters): FilterStore {
    const cloned = this.clone()
    cloned.selectedFilters = selectedFilters
    return cloned
  }

  mergeSelectedFilters(selectedFilters: SelectedFilters): FilterStore {
    const cloned = this.clone()
    cloned.selectedFilters = new SelectedFilters(...uniqBy('field', [...cloned.selectedFilters, ...selectedFilters]))
    return cloned
  }

  clearSelectedFilters(): FilterStore {
    const cloned = this.clone()
    cloned.selectedFilters = new SelectedFilters()
    return cloned
  }

  clearSelectedFilter(filterId: string | undefined): FilterStore {
    const filter = this.filters.find((filter) => filter.getId() === filterId)
    if (!filter) return this

    const cloned = this.clone()
    cloned.selectedFilters = cloned.selectedFilters.filter((filter) => filter.field !== filter.field)
    return cloned
  }

  changeSelectedFilterValue(field: string, value: any): FilterStore {
    const cloned = this.clone()
    const baseFilter = cloned.filters.find((filter) => filter.field === field)
    cloned.selectedFilters = cloned.selectedFilters.changeFilterValue(field, value, baseFilter?.singleChoice)
    return cloned
  }

  setSearchTerm(data: Data, field: string, term: string | undefined): FilterStore {
    const cloned = this.clone()
    const values = this.filters.find((filter) => filter.field === field)?.values ?? []
    cloned.searchFilters = cloned.searchFilters.setFilterTerm(data, field, term, values)
    return cloned
  }

  setSearchValues(data: Data, field: string, values: any[]): FilterStore {
    const cloned = this.clone()
    cloned.searchFilters = cloned.searchFilters.setFilterValues(data, field, values)
    return cloned
  }

  setAdvancedMode(enabled = false) {
    const cloned = this.clone()
    cloned.isAdvancedMode = enabled
    return cloned
  }

  isSameSelectedFilters(selectedFilters: Partial<SelectedFilter>[]): boolean {
    if (this.selectedFilters.length !== selectedFilters.length) return false
    return selectedFilters.every((filter) => {
      const stateFilter = this.selectedFilters.find((stateFilter) => stateFilter.field === filter.field)
      if (!stateFilter) return false
      return filter.field === stateFilter.field && JSON.stringify(filter.values) === JSON.stringify(stateFilter.values)
    })
  }

  hasVisibleSelectedFilters(): boolean {
    return this.selectedFilters.some((selectedFilter) => this.filters.exists(selectedFilter.field))
  }
}
