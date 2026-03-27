import {getSchemaId} from '../schema-repository.js'
import {BaseMigration} from './BaseMigration.js'
import omit from 'lodash/fp/omit.js'

export class SchemaMigration044to045 extends BaseMigration {
  migrateObjects(visualization: Record<string, any>): any {
    if (visualization.type !== 'CHART') return visualization
    return omit(['initialPosition'], visualization)
  }

  getSchemaVersion(): string {
    return getSchemaId('0.45')
  }
}
