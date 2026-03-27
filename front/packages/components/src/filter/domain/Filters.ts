import {findIndex} from 'lodash/fp'
import {Filter} from './Filter'
import { Data } from '@hopara/encoding'

export class Filters extends Array<Filter> {
  clone(): Filters {
    return new Filters(...this)
  }

  map(mapFunc): Filters {
    const mapped = super.map(mapFunc) as Filter[]
    return new Filters(...mapped)
  }

  exists(field: string): boolean {
    return this.some((f) => f.field === field)
  }

  getByField(field: string): Filter | undefined {
    return this.find((filter) => filter.field === field)
  }

  getById(id: string): Filter | undefined {
    return this.find((filter) => filter.getId() === id)
  }

  getByData(data:Data): Filter | undefined {
    return this.find((filter) => filter.data.isEqual(data))
  }

  getByDataAndField(data: Data, field: string): Filter | undefined {
    return this.find((filter) => filter.data.isEqual(data) && filter.field === field)
  }

  setFilterValues(id: string, values: any[]): Filters {
    const cloned = this.clone()
    const index = cloned.findIndex((filter) => filter.getId() === id)
    const filter = cloned[index]
    cloned.splice(index, 1, filter.setValues(values))
    return cloned
  }

  move(id: string, steps: number) {
    const cloned = this.clone()
    const index = cloned.findIndex((filter) => filter.getId() === id)
    const filter = cloned[index]
    cloned.splice(index, 1)
    cloned.splice(index + steps, 0, filter)
    return cloned
  }

  delete(id: string) {
    const cloned = this.clone()
    const index = cloned.findIndex((item) => item.getId() === id)
    if (cloned[index]) {
      cloned.splice(index, 1)
    }
    return cloned
  }

  upsert(item: Filter): Filters {
    const newFilterObj = new Filter(item)
    const cloned = new Filters(...this)

    const index = findIndex((filter) => filter.getId() === item.getId(), this)
    if (index > -1) {
      cloned.splice(index, 1, newFilterObj)
    } else {
      cloned.push(newFilterObj)
    }
    return cloned
  }

  immutableSet(id: string | undefined, attributes: Partial<Filter>) {
    if (!id) return this
    const cloned = this.clone()
    const index = findIndex((filter) => filter.getId() === id, this)
    const filter = new Filter({...cloned[index], ...attributes})
    cloned.splice(index, 1, filter)
    return cloned
  }

  getFieldList(): string[] {
    const fieldList: string[] = []
    this.forEach((filter) => {
      if (filter.field) {
        fieldList.push(filter.field)
      }
    })
    return fieldList
  }
}
