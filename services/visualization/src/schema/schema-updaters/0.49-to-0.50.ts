import {deepReplace} from 'gdeep-replace'
import {getSchemaId} from '../schema-repository.js'
import {BaseMigration} from './BaseMigration.js'
import {Details, DetailsField} from '../../layer/domain/spec/Details.js'
import omit from 'lodash/fp/omit.js'

export class SchemaMigration049to050 extends BaseMigration {
  migrateDetailsField(detailsField: DetailsField): any {
    return omit('id', detailsField)
  }

  migrateDetails(details: Details): { details: Details } {
    const newDetails = {...details}
    if (details.fields) {
      newDetails.fields = details.fields.map(this.migrateDetailsField)
    }
    return {details: newDetails}
  }

  migrateObjects(visualization: Record<string, any>): any {
    const migrated = deepReplace(visualization, 'details', (_, value) => this.migrateDetails(value))
    return migrated
  }

  getSchemaVersion(): string {
    return getSchemaId('0.50')
  }
}
