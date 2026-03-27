import { deepReplace } from 'gdeep-replace'
import {getSchemaId} from '../schema-repository.js'
import {BaseMigration} from './BaseMigration.js'

const typesMap = {
  ordinal: 'sorted',
  consistentOrdinal: 'hashed',
  quantile: 'grouped',
  quantize: 'linear',
}

export class SchemaMigration047to048 extends BaseMigration {
  migrateColor(colorEncoding:any) {
    const scale = colorEncoding.scale
    if ( scale ) {
      const migratedScale = {
        ...scale,
        colors: scale.range,
        values: scale.domain,
        type: typesMap[scale.type],
      }

      delete migratedScale.range
      delete migratedScale.domain
      return {
        color: {
         ...colorEncoding,
         scale: migratedScale,
        },
      }
    }

   return {color: colorEncoding}
  }

  migrateStrokeColor(colorEncoding:any) {
    const scale = colorEncoding.scale
    if ( scale ) {
      const migratedScale = {
        ...scale,
        colors: scale.range,
        values: scale.domain,
        type: typesMap[scale.type],
      }

      delete migratedScale.range
      delete migratedScale.domain
      return {
        strokeColor: {
         ...colorEncoding,
         scale: migratedScale,
        },
      }
    }

   return {strokeColor: colorEncoding}
  }

  doMigrateCondition(condition:any) {
    if ( 'reverse' in condition ) {
      condition.test = {
        ...condition.test,
        reverse: condition.reverse,
      }
      delete condition.reverse
    }

    return condition
  }

  migrateCondition(condition:any) {
    return { condition: this.doMigrateCondition(condition) }
  }

  migrateConditions(conditions:any[]) {
    return { conditions: conditions.map(this.doMigrateCondition) }
  }

  migrateObjects(visualization: Record<string, any>): any {
    let migrated = deepReplace(visualization, 'color', (key, value) => this.migrateColor(value))
    migrated = deepReplace(migrated, 'strokeColor', (key, value) => this.migrateStrokeColor(value))
    migrated = deepReplace(migrated, 'conditions', (key, value) => this.migrateConditions(value))
    migrated = deepReplace(migrated, 'condition', (key, value) => this.migrateCondition(value))
    if ( migrated.mapStyle ) {
      delete migrated.mapStyle
    }
    return migrated
  }

  getSchemaVersion(): string {
    return getSchemaId('0.48')
  }
}
