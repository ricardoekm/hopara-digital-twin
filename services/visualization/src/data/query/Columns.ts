type Column = {
  name: string
  type: string
  quantitative?: boolean
  temporal?: boolean
  primaryKey?: boolean
}

export class Columns extends Array<Column> {
  getColumn(fieldName:string): Column | undefined {
    return this.find((column) => column.name === fieldName)
  }

  hasPrimaryKey() : boolean {
    return this.some((column) => column.primaryKey)
  }
}
