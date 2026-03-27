import { Data } from '@hopara/encoding'

export class SearchFilter {
  field: string
  data: Data
  term?: string
  values: any[]

  constructor(props?: Partial<SearchFilter>) {
    Object.assign(this, props)
    this.data = new Data(this.data ?? {})
    this.values = this.values ?? []
  }

  clone(): SearchFilter {
    return new SearchFilter(this)
  }

  setTerm(term: string | undefined): SearchFilter {
    const cloned = this.clone()
    cloned.term = term
    return cloned
  }

  setValues(values: any[]): SearchFilter {
    const cloned = this.clone()
    cloned.values = values
    return cloned
  }
}
