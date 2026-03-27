export class Table {
  readonly name: string

  constructor(params: Partial<Table>) {
    Object.assign(this, params)
  }
}
