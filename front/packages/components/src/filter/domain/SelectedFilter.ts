import {classToPlain} from 'class-transformer'
import { isNil } from 'lodash/fp'
import 'reflect-metadata'
import { ComparisonType } from './Filter'

export type FilterValue = string | number | boolean

export class SelectedFilter {
  field: string
  values: FilterValue[]
  comparisonType?: ComparisonType

  constructor(props?: Partial<SelectedFilter>) {
    Object.assign(this, props)
    this.values = this.values ?? []
  }

  clone(): SelectedFilter {
    return new SelectedFilter(this)
  }

  setValues(values: any): SelectedFilter {
    const cloned = this.clone()
    cloned.values = values
    return cloned
  }

  hasValue(value: FilterValue): boolean {
    return this.values.indexOf(value) > -1
  }

  addValue(value: any): SelectedFilter {
    if (this.hasValue(value)) return this

    const cloned = this.clone()
    cloned.values.push(value)
    return cloned
  }

  removeValue(value: FilterValue): SelectedFilter {
    if (!this.hasValue(value)) return this

    const valueIndex = this.values.indexOf(value)
    const cloned = this.clone()
    cloned.values.splice(valueIndex, 1)
    return cloned
  }

  toggleValue(value: FilterValue, singleChoice = false): SelectedFilter {
    const cloned = this.clone()
    
    if (isNil(value) || value === '') return cloned.setValues([])
    if (Array.isArray(value) && !singleChoice) return cloned.setValues(value)
    if (singleChoice) return cloned.setValues([Array.isArray(value) ? value[0] : value])
    if (cloned.hasValue(value)) return cloned.removeValue(value)
    return cloned.addValue(value)
  }

  toPlain(): any {
    return classToPlain(this)
  }
}
