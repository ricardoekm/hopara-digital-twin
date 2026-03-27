import {get, omit} from 'lodash/fp'
import {Filter} from './domain/Filter'
import {Filters} from './domain/Filters'

export const parseFilters = (response): Filters => {
  const visualization = get('visualization', response)
  return new Filters(...visualization.filters.map((filter) => (
    new Filter(omit(['visualization'], filter))
  )))
}
