import {getSchemaId} from '../schema-repository.js'
import {BaseMigration} from './BaseMigration.js'

export class SchemaMigration048to049 extends BaseMigration {
  migrateObjects(visualization: Record<string, any>): any {
    if ( !visualization.group ) {
      return {
        ...visualization,
        group: 'USER'
      }
    }

    return visualization
  }

  getSchemaVersion(): string {
    return getSchemaId('0.49')
  }
}
