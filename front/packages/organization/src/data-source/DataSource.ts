export enum DataSourceType {
  POSTGRES = 'POSTGRES',
  MYSQL = 'MYSQL',
  SINGLESTORE = 'SINGLESTORE',
  TIMESCALE = 'TIMESCALE',
  DUCKDB = 'DUCKDB',
  SNOWFLAKE = 'SNOWFLAKE',
  JS_FUNCTION = 'JS_FUNCTION'
}

export class DataSource {
  readonly name: string
  readonly host: string
  readonly port?: number
  readonly username: string
  readonly password: string
  readonly database: string
  readonly schema?: string
  readonly type: DataSourceType
  readonly default: boolean
  readonly annotation?: string
  readonly maxConnections?: number
  readonly quoteIdentifiers?: boolean


  constructor(params: Partial<DataSource>) {
    Object.assign(this, params)
    if (this.annotation === DataSourceType.JS_FUNCTION) {
      this.type = DataSourceType.DUCKDB
    }
  }

  isReadOnly(): boolean {
    return this.default
  }

  isEditable(): boolean {
    return !this.isReadOnly() && this.type !== DataSourceType.DUCKDB
  }

  getType() {
    if (this.annotation === DataSourceType.JS_FUNCTION) {
      return DataSourceType.JS_FUNCTION
    }
    return this.type
  }
}

