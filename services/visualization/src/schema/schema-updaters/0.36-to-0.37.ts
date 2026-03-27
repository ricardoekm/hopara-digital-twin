import {deepReplace} from 'gdeep-replace'
import {getSchemaId} from '../schema-repository.js'
import {BaseMigration} from './BaseMigration.js'

export class SchemaMigration036to037 extends BaseMigration {
  migrateEncoding(encoding: any): any {
    if (encoding.color?.shadow) {
      encoding.shadow = encoding.color.shadow
      delete encoding.color.shadow
    }

    return {encoding}
  }


  migrateObjects(visualization: Record<string, any>): any {
    return deepReplace(visualization, 'encoding', (key, value) => this.migrateEncoding(value))
  }


  getSchemaVersion(): string {
    return getSchemaId('0.37')
  }
}
