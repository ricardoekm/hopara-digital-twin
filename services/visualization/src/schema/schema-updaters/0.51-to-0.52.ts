import { deepReplace } from 'gdeep-replace'
import {getSchemaId} from '../schema-repository.js'
import {BaseMigration} from './BaseMigration.js'
import { MapEncoding, MapStyle } from '../../encoding/domain/spec/MapEncoding.js'

export class SchemaMigration051to052 extends BaseMigration {
  migrateGoogleMap(encoding: MapEncoding): MapEncoding {
    return Object.assign({}, encoding, {
      value: encoding.value === MapStyle.satellite ? MapStyle.googleMapsSatellite : encoding.value,
    })
  }

  migrateObjects(visualization: Record<string, any>): any {
    const migrated = deepReplace(visualization, 'map', (key, value) => ({[key]: this.migrateGoogleMap(value)}))
    return migrated
  }

  getSchemaVersion(): string {
    return getSchemaId('0.52')
  }
}
