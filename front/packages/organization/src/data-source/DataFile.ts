export class DataFile {
  readonly name: string
  readonly dataSource: string

  constructor(params: Partial<DataFile>) {
    Object.assign(this, params)
  }
}
