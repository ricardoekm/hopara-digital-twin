import {DetailsFields} from './DetailsFields'

export class Details {
  fields: DetailsFields
  tooltip?: boolean
  enabled?: boolean

  constructor(props?: Partial<Details>) {
    Object.assign(this, props ?? {})
    this.fields = new DetailsFields(...(this.fields ?? []))
  }

  immutableSetFields(fields: DetailsFields) {
    return new Details({...this, fields})
  }
}
