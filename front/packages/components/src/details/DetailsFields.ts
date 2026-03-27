import {DetailsField} from './DetailsField'
import {Columns} from '@hopara/dataset'

export class DetailsFields extends Array<DetailsField> {
  constructor(...props: Partial<DetailsField>[]) {
    const fields = (props ?? [])
      .filter((field) => !!field)
      .map((field) => new DetailsField(field))
    super(...fields)
  }

  findByField(field: string): DetailsField | undefined {
    return this.find((detailsField) => {
      const encodingField = detailsField.value.encoding.text?.field ?? detailsField.value.encoding.image?.field
      return encodingField === field
    })
  }

  getVisible() : DetailsFields {
    return new DetailsFields(...this.filter((field) => field.visible))
  }

  findById(field?: string): DetailsField | undefined {
    return this.find((detailsField) => detailsField.getField() === field)
  }

//  Details       Columns     Result
//  +--------+    +-------+   +--------+
//  | field  |    | field |   | field  |
//  +--------+    +-------+   +--------+
//  | amora  |    | uva   |   | amora  |
//  | banana |    | amora |   | ca.qui |
//  | ca.qui |    |       |   | uva    |
//  +--------+    +-------+   +--------+
  rightJoinColumns(columns: Columns): DetailsFields {
    columns = columns.getPrintables()
    const columnFields = new DetailsFields(...columns.map(DetailsField.fromColumn))

    const detailsFieldsWithValidFieldOrFieldContainingDot = new DetailsFields(...this.filter((detailsField) => {
      const field = detailsField.getField()
      return columns.has(field) || field?.includes('.')
    }))
    const columnsWithoutDetailsFields = columnFields.filter((column) => !detailsFieldsWithValidFieldOrFieldContainingDot.findByField(column.getField()))
    return new DetailsFields(
      ...detailsFieldsWithValidFieldOrFieldContainingDot,
      ...columnsWithoutDetailsFields,
    )
  }

  // Details       Columns     Result
  // +--------+    +-------+   +--------+
  // | field  |    | field |   | field  |
  // +--------+    +-------+   +--------+
  // | amora  |    | uva   |   | amora  |
  // | banana |    | amora |   | banana |
  // | ca.qui |    |       |   | ca.qui |
  // |        |    |       |   | uva    |
  // +--------+    +-------+   +--------+
  unionColumns(columns: Columns): DetailsFields {
    columns = columns.getPrintables()
    const fields = new DetailsFields(...[...this])

    columns.forEach((column) => {
      const exists = fields.findByField(column.name)
      if (!exists) {
        fields.push(DetailsField.fromColumn(column).hide())
      }
    })
    return fields
  }

  immutableHideField(field?: string): DetailsFields {
    return new DetailsFields(...this.map((detailsField) => detailsField.getField() === field ? detailsField.hide() : detailsField))
  }

  immutableShowField(id?: string): DetailsFields {
    return new DetailsFields(...this.map((detailsField) => detailsField.getField() === id ? detailsField.show() : detailsField))
  }

  findIndexByColumnPredicate(columns:Columns, predicate) {
    const column = columns.find(predicate)
    if (column) {
      return this.findIndex((f) => column?.isEquivalent(f.getField()))
    }

    return -1
  }

  swap(from: number, to: number) {
    const temp = this[to]
    this[to] = this[from]
    this[from] = temp
  }

  swapTo(columns: Columns, index: number, condition) {
    const column = columns.get(this[index].getField())
    if (!condition(column)) {
      const fromIndex = this.findIndexByColumnPredicate(columns, condition)
      if (fromIndex !== -1) {
        this.swap(fromIndex, index)
      }
    }
  }
}
