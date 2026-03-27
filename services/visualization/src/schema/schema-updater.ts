import semver from 'semver'
import {VisualizationSpec} from '../visualization/domain/spec/Visualization.js'

import {SchemaVersionMigration} from './schema-updaters/SchemaMigration.js'
import {getCurrentAppVersion, getSchemaEndpoint} from './schema-repository.js'
import {SchemaMigration031to032} from './schema-updaters/0.31-to-0.32.js'
import {SchemaMigration032to033} from './schema-updaters/0.32-to-0.33.js'
import {SchemaMigration033to034} from './schema-updaters/0.33-to-0.34.js'
import {SchemaMigration034to035} from './schema-updaters/0.34-to-0.35.js'
import {SchemaMigration035to036} from './schema-updaters/0.35-to-0.36.js'
import {SchemaMigration036to037} from './schema-updaters/0.36-to-0.37.js'
import {SchemaMigration037to038} from './schema-updaters/0.37-to-0.38.js'
import {SchemaMigration038to039} from './schema-updaters/0.38-to-0.39.js'
import {SchemaMigration039to040} from './schema-updaters/0.39-to-0.40.js'
import {SchemaMigration040to041} from './schema-updaters/0.40-to-0.41.js'
import {SchemaMigration041to042} from './schema-updaters/0.41-to-0.42.js'
import {SchemaMigration042to043} from './schema-updaters/0.42-to-0.43.js'
import {SchemaMigration043to044} from './schema-updaters/0.43-to-0.44.js'
import {SchemaMigration044to045} from './schema-updaters/0.44-to-0.45.js'
import {SchemaMigration045to046} from './schema-updaters/0.45-to-0.46.js'
import {SchemaMigration046to047} from './schema-updaters/0.46-to-0.47.js'
import {SchemaMigration047to048} from './schema-updaters/0.47-to-0.48.js'
import {SchemaMigration048to049} from './schema-updaters/0.48-to-0.49.js'
import { SchemaMigration049to050 } from './schema-updaters/0.49-to-0.50.js'
import { SchemaMigration050to051 } from './schema-updaters/0.50-to-0.51.js'
import { SchemaMigration051to052 } from './schema-updaters/0.51-to-0.52.js'
import { SchemaMigration052to053 } from './schema-updaters/0.52-to-0.53.js'
import { SchemaMigration053to054 } from './schema-updaters/0.53-to-0.54.js'
import { SchemaMigration054to055 } from './schema-updaters/0.54-to-0.55.js'
import { SchemaMigration055to056 } from './schema-updaters/0.55-to-0.56.js'
import { SchemaMigration056to057 } from './schema-updaters/0.56-to-0.57.js'
import { SchemaMigration058to059 } from './schema-updaters/0.58-to-0.59.js'

const migrations: Record<string, SchemaVersionMigration> = {
  '0.31': new SchemaMigration031to032(),
  '0.32': new SchemaMigration032to033(),
  '0.33': new SchemaMigration033to034(),
  '0.34': new SchemaMigration034to035(),
  '0.35': new SchemaMigration035to036(),
  '0.36': new SchemaMigration036to037(),
  '0.37': new SchemaMigration037to038(),
  '0.38': new SchemaMigration038to039(),
  '0.39': new SchemaMigration039to040(),
  '0.40': new SchemaMigration040to041(),
  '0.41': new SchemaMigration041to042(),
  '0.42': new SchemaMigration042to043(),
  '0.43': new SchemaMigration043to044(),
  '0.44': new SchemaMigration044to045(),
  '0.45': new SchemaMigration045to046(),
  '0.46': new SchemaMigration046to047(),
  '0.47': new SchemaMigration047to048(),
  '0.48': new SchemaMigration048to049(),
  '0.49': new SchemaMigration049to050(),
  '0.50': new SchemaMigration050to051(),
  '0.51': new SchemaMigration051to052(),
  '0.52': new SchemaMigration052to053(),
  '0.53': new SchemaMigration053to054(),
  '0.54': new SchemaMigration054to055(),
  '0.55': new SchemaMigration055to056(),
  '0.56': new SchemaMigration056to057(),
  '0.58': new SchemaMigration058to059(),
}

export const extractVersionFromSchema = (schema: string): string => {
  const version = semver.coerce(schema)
  if (version) {
    return `${version.major}.${version.minor}`
  }
  return getCurrentAppVersion()
}

export const versionIsGte = (version: string, targetVersion: string): boolean => {
  const v1 = semver.coerce(version)
  const v2 = semver.coerce(targetVersion)
  return semver.gte(v1!, v2!)
}

export const versionIsEq = (version: string, targetVersion: string): boolean => {
  const v1 = semver.coerce(version)
  const v2 = semver.coerce(targetVersion)
  return semver.eq(v1!, v2!)
}

export const getSpecVersion = (spec: Record<string, any>): string => {
  if (!spec.$schema) return getCurrentAppVersion()
  return extractVersionFromSchema(spec.$schema)
}

export class SchemaMigration {
  static migrate(spec: Record<string, any>): VisualizationSpec {
    const newSpec = Object.keys(migrations).reduce((migratedSpec, migrationNumber) => {
      const schemaNumber = getSpecVersion(migratedSpec)
      migrationNumber = extractVersionFromSchema(migrationNumber)
      if (schemaNumber !== migrationNumber) return migratedSpec

      const migration = migrations[schemaNumber]
      if (!migration) return migratedSpec

      try {
        return migration.migrate(migratedSpec)
      } catch (e: any) {
        throw new Error(`Error migrating visualization from version ${migrationNumber}: ${e.message}`)
      }
    }, spec) as VisualizationSpec
    newSpec.$schema = `${getSchemaEndpoint()}/${getCurrentAppVersion()}`
    return newSpec
  }
}
