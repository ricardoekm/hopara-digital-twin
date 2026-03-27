import { deepReplace } from 'gdeep-replace'
import {getSchemaId} from '../schema-repository.js'
import {BaseMigration} from './BaseMigration.js'

export class SchemaMigration035to036 extends BaseMigration {
  migrateColorEncoding(encoding: any): any {
    if ( encoding.condition ) {
      const newEncoding = {...encoding}
      delete newEncoding.condition
      newEncoding.conditions = [encoding.condition]
      return { color: newEncoding }
    }

    return {color: encoding}
  }


  migrateObjects(visualization: Record<string, any>): any {
    return deepReplace(visualization, 'color', (key, value) => this.migrateColorEncoding(value))
  }


  getSchemaVersion(): string {
    return getSchemaId('0.36')
  }
}
