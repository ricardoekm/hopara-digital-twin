export class Query {
  readonly name: string
  readonly query: string
  readonly dataSource: string
  readonly primaryKey: string
  readonly writeTable: string
  readonly writeLevel?: 'UPDATE'

  constructor(params: Partial<Query>) {
    Object.assign(this, params)
  }
}

