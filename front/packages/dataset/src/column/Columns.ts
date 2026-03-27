import {Column} from './Column'
import { ColumnType } from './ColumnType'

export class Columns extends Array<Column> {
  constructor(...columns: Column[]) {
    const cls: Column[] = []
    for (const column of columns) {
      const existingIndex = cls.findIndex((c) => c.name === column.name)
      if (existingIndex > -1) {
        cls.splice(existingIndex, 1, column)
        continue
      }

      if (column) cls.push(column)
    }
    super(...cls)
  }

  get(name?:string | null) : Column | undefined {
    return this.find((c:Column) => c.isEquivalent(name))
  }

  getPrintables() : Columns {
    return new Columns(...this.filter((column) => column.isPrintable()))
  }

  getPrimaryKey() : Column | undefined {
    return this.find((column) => column.primaryKey)
  }

  hasPrimaryKey() : boolean {
    return !!this.find((column) => column.primaryKey)
  }

  pickByNames(names: string[] = []): Columns {
    const picked = new Columns()
    names.forEach((name) => {
      const column = this.get(name)
      if (column) picked.push(column)
    })
    return picked
  }

  pickByType(type: ColumnType): Columns {
    const picked = this.filter((column) => column.isType(type))
    return new Columns(...picked)
  }

  has(name:string) : boolean {
    return !!this.get(name)
  }

  mergeWithKeepingOlds(columns?: Columns): Columns {
    const cloned = new Columns(...this)
    if (!columns) {
      return cloned
    }

    for (const column of columns) {
      if (!cloned.has(column.name)) {
        cloned.push(column)
      }
    }
    return cloned
  }

  isSame(columns: Columns): boolean {
    if (this.length !== columns.length) return false
    return this.every((column) => !!columns.get(column.name))
  }
}
