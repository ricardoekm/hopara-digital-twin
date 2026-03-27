import { deepReplace } from 'gdeep-replace'
import {getSchemaId} from '../schema-repository.js'
import {BaseMigration} from './BaseMigration.js'
import { DetailsField } from '../../layer/domain/spec/Details.js'
import omit from 'lodash/fp/omit.js'
import { MaxLength, MaxLengthLimitType } from '../../encoding/domain/spec/TextEncoding.js'

export class SchemaMigration050to051 extends BaseMigration {
  migrateDetailsField(detailsField: DetailsField): any {
    return omit('id', detailsField)
  }

  migrateMaxLength(oldMaxLength: Partial<MaxLength & {overflow: any}>): {maxLength: MaxLength} {
    const maxLength = {value: oldMaxLength.value, type: oldMaxLength.value ? MaxLengthLimitType.FIXED : MaxLengthLimitType.NONE}
    if (oldMaxLength.overflow === 'WRAP') maxLength.type = MaxLengthLimitType.AUTO
    return {maxLength}
  }

  migrateObjects(visualization: Record<string, any>): any {
    const migrated = deepReplace(visualization, 'maxLength', (key, value) => this.migrateMaxLength(value))
    return migrated
  }

  getSchemaVersion(): string {
    return getSchemaId('0.51')
  }
}
