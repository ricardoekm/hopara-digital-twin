export class QueryNotFoundError implements Error {
  name: 'QuerySchemaError'
  message: string

  constructor(props: { queryName: string, error?: string }) {
    this.message = props.error ?? `query '${props.queryName}' must exist`
  }
}
