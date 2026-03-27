import { deepReplace } from 'gdeep-replace'
import {getSchemaId} from '../schema-repository.js'
import {BaseMigration} from './BaseMigration.js'

export class SchemaMigration032to033 extends BaseMigration {
  migrateTextEncoding(textEncoding:any) {
    const newEncoding = {...textEncoding}
    
    if (textEncoding.suffix) {
      newEncoding['suffix'] = { value: textEncoding.suffix} 
    }

    if (textEncoding.prefix) {
      newEncoding['prefix'] = { value: textEncoding.prefix} 
    }

    return newEncoding
  }

  migrateObjects(visualization: Record<string, any>): any {
    return deepReplace(visualization, 'text', (key, value) => ({text: this.migrateTextEncoding(value)}))
  }


  getSchemaVersion(): string {
    return getSchemaId('0.33')
  }
}
