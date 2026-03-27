import { Filter } from './Filter'
import { SelectedFilters } from './SelectedFilters'

export enum AutoFillMode {
  ALWAYS = 'ALWAYS',
  IF_NO_OTHER_FILTER_FILLED = 'IF_NO_OTHER_FILTER_FILLED'
}

export type AutoFill = {
  mode: AutoFillMode
  values?: string[]
}

const filterCanBeAutoFilled = (filter: Filter, selectedFilters: SelectedFilters): boolean => {
  const hasOtherFilterFilled = selectedFilters.some((f) => f.field !== filter.field && f.values.length > 0)
  return (filter.autoFill?.mode === AutoFillMode.IF_NO_OTHER_FILTER_FILLED && !hasOtherFilterFilled) ||
          filter.autoFill?.mode === AutoFillMode.ALWAYS
}

const filterShouldBeAutoFilled = (filter: Filter, selectedFilters: SelectedFilters): boolean => {
  const hasSelectedValues = !!selectedFilters.find((f) => f.field === filter.field)?.values?.length
  const canBeAutoFilled = filterCanBeAutoFilled(filter, selectedFilters)
  const hasAutoFillValues = !!filter.autoFill?.values?.length || !!filter.values?.length

  return !hasSelectedValues && canBeAutoFilled && hasAutoFillValues
}

export const getAutoFillValues = (filter: Filter, selectedFilters: SelectedFilters): any[] => {
  if (!filterShouldBeAutoFilled(filter, selectedFilters)) return []
  if (filter.autoFill?.values?.length) return filter.autoFill.values
  return [filter.values[0]]
}
