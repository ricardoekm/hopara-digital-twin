import { deepReplace } from 'gdeep-replace'
import {getSchemaId} from '../schema-repository.js'
import {BaseMigration} from './BaseMigration.js'

export class SchemaMigration052to053 extends BaseMigration {
  getPositionType(positionEncoding:any) {
    if ( positionEncoding.data ) {
      if ( positionEncoding.data.layerId ) {
        return 'REF'
      }

      if ( positionEncoding.data && positionEncoding.data.source && positionEncoding.data.query ) {
        if ( positionEncoding.data.source === 'hopara' ) {
          const regex = /[A-Za-z0-9]*_[A-Za-z0-9]*_pos$/
          if ( positionEncoding.data.query?.match(regex) ) {
            return 'MANAGED'
          } 
        }
        
        return 'CUSTOM'
      }
    }

    return 'CLIENT'
  }

  addPositionType(positionEncoding: any): any {
    return {
      ...positionEncoding,
      type: this.getPositionType(positionEncoding)
    }
  }

  migrateObjects(visualization: Record<string, any>): any {
    const migrated = deepReplace(visualization, 'position', (key, value) => ({[key]: this.addPositionType(value)}))
    return migrated
  }

  getSchemaVersion(): string {
    return getSchemaId('0.53')
  }
}
