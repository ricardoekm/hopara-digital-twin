import { deepReplace } from 'gdeep-replace'
import {getSchemaId} from '../schema-repository.js'
import {BaseMigration} from './BaseMigration.js'
import first from 'lodash/fp/first.js'

export class SchemaMigration034to035 extends BaseMigration {
  getTransformType(transform:any) {
    return first(Object.keys(transform))
  }

  migrateStrokeColor(encoding: any): any {
    if ( encoding === false ) {
      return undefined
    }

    return {strokeColor: encoding}
  }

  migrateStrokeSize(encoding: any): any {
    if ( encoding === false ) {
      return undefined
    }

    return {strokeSize: encoding}
  }


  migrateObjects(visualization: Record<string, any>): any {
    const result = deepReplace(visualization, 'strokeColor', (key, value) => this.migrateStrokeColor(value))
    return deepReplace(result, 'strokeSize', (key, value) => this.migrateStrokeSize(value))
  }


  getSchemaVersion(): string {
    return getSchemaId('0.35')
  }
}
