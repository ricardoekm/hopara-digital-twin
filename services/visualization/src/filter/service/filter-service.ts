import Filter from '../domain/Filter.js'

export class FilterService {
  static getFilterDraft(): Filter {
    return Filter.createDraft()
  }
}
