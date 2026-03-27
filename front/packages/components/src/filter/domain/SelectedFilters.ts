import {SelectedFilter} from './SelectedFilter'

export class SelectedFilters extends Array<SelectedFilter> {
  push(item: SelectedFilter): number {
    const existingFilterIndex = this.findIndex((filter: SelectedFilter) => filter.field === item.field)

    if (existingFilterIndex > -1) {
      return this.splice(existingFilterIndex, 1, item).length
    }

    return super.push(item)
  }

  clone(): SelectedFilters {
    return new SelectedFilters(...this)
  }

  map(mapFunc): SelectedFilters {
    const mapped = super.map(mapFunc) as SelectedFilter[]
    return new SelectedFilters(...mapped)
  }

  filter(filterFunc): SelectedFilters {
    const filtered = super.filter(filterFunc) as SelectedFilter[]
    return new SelectedFilters(...filtered)
  }

  getByField(field: string): SelectedFilter | undefined {
    return this.find((filter) => filter.field === field)
  }

  changeFilterValue(field: string, value: any | any[], singleChoice?: boolean): SelectedFilters {
    const cloned = this.clone()
    
    const filterIndex = cloned.findIndex((f) => f.field === field)
    const filterExists = filterIndex > -1

    const newFilter = filterExists ? cloned[filterIndex]?.toggleValue(value, singleChoice) : undefined
    if (newFilter?.values.length) {
      cloned.splice(filterIndex, 1, newFilter)
    } else if (newFilter) {
      cloned.splice(filterIndex, 1)
    } else if (value !== undefined && value !== '') {
      const values = Array.isArray(value) ? value : [value]
      const filter = new SelectedFilter({field, values})
      cloned.push(filter)
    }

    return cloned
  }

  getValuesCount(): number {
    return this.reduce((acc, filter) => acc + filter.values.length, 0)
  }

  someFromFieldList(fields: string[]): boolean {
    return this.some((filter) => fields.includes(filter.field))
  }

  getByFieldList(fields: string[]): SelectedFilters {
    return this.filter((filter) => fields.includes(filter.field))
  }
}
