import {DataSource, LoggerOptions, Migration} from 'typeorm'
import {Config} from '../config/index.js'
import path from 'path'
import fs from 'fs'

// query - logs all queries.
//
//   error - logs all failed queries and errors.
//
//   schema - logs the schema build process.
//
//   warn - logs internal orm warnings.
//
//   info - logs internal orm informative messages.
//
//   log - logs internal orm log messages.

const error = ['error']
const warn = [...error, 'warn']
const info = [...warn, 'info']
const debug = [...info, 'log', 'query', 'schema']

const levels = {
  error,
  warn,
  info,
  debug,
}

export class DataSourceFactory {
  constructor(private config: Config) {
  }

  async create(schema: string | undefined, entities: any[] = [], logLevel: keyof typeof levels): Promise<DataSource> {
    const {database} = this.config

    let migrations: string[] = []

    if (process.env.NODE_ENV !== 'test') {
      const migrationsDir = 'out/src/migrations'
      const files = fs.readdirSync(migrationsDir)
      migrations = files.map((file: string) => {
        return path.join(migrationsDir, file)
      }).filter((file: string) => file.endsWith('js'))
    }

    const ds = new DataSource({
      schema,
      type: 'postgres',
      host: database.host,
      port: database.port,
      username: database.user,
      password: database.password as string,
      database: database.database,
      migrations,
      migrationsTableName: 'hp_typeorm_app_migrations',
      metadataTableName: 'hp_typeorm_app_metadata',
      logging: levels[logLevel] as LoggerOptions,
      entities,
    })
    await ds.initialize()
    return ds
  }
}

export class MigrationService {
  constructor(private readonly config: Config) {
  }

  async migrate(schema: string): Promise<Migration[]> {
    const dataSource = await new DataSourceFactory(this.config).create(schema, undefined, 'debug')
    await dataSource.query(`SET SCHEMA '${schema}'`)
    const result = await dataSource.runMigrations()
    await dataSource.destroy()
    return result
  }
}
