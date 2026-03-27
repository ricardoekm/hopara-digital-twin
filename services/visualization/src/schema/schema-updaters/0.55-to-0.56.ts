import { deepReplace } from 'gdeep-replace'
import {getSchemaId} from '../schema-repository.js'
import {BaseMigration} from './BaseMigration.js'

export class SchemaMigration055to056 extends BaseMigration {
  migrateAnimation(encoding:any) {
    const animation = encoding.color?.animation || encoding.size?.animation
    if ( !animation ) {
      return {encoding}
    }

    return {encoding: {
      ...encoding,
      animation: {
        enabled: true,
        ...animation
      }
    }}
  }

  migrateObjects(visualization: Record<string, any>): any {
    const migrated = deepReplace(visualization, 'encoding', (key, value) => this.migrateAnimation(value))
    return migrated
  }


  getSchemaVersion(): string {
    return getSchemaId('0.56')
  }
}
