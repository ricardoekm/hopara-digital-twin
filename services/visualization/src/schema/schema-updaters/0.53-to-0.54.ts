import { deepReplace } from 'gdeep-replace'
import {getSchemaId} from '../schema-repository.js'
import {BaseMigration} from './BaseMigration.js'

export class SchemaMigration053to054 extends BaseMigration {
  migrateTemplate(template:any) {
    const newTemplate = {
      id: template.id,
      ...template.data
    }
    return {template: newTemplate}
  }

  migrateObjects(visualization: Record<string, any>): any {
    const migrated = deepReplace(visualization, 'template', (key, value) => this.migrateTemplate(value))
    return migrated
  }


  getSchemaVersion(): string {
    return getSchemaId('0.54')
  }
}
