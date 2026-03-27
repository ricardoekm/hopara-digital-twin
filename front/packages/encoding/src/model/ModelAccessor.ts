import {Row} from '@hopara/dataset'
import {ModelEncoding} from './ModelEncoding'

export class ModelAccessor {
  static getModel(encoding: ModelEncoding | undefined, row?: Row) {
    return encoding?.getId(row) ?? 'placeholder'
  }
}
