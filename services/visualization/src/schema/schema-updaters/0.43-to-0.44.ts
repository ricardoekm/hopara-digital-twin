import {deepReplace} from 'gdeep-replace'
import {getSchemaId} from '../schema-repository.js'
import {BaseMigration} from './BaseMigration.js'

export class SchemaMigration043to044 extends BaseMigration {
  migrateColor(colorEncoding:any) {
    const scale = colorEncoding.scale
    if ( scale && scale.type === 'ordinal' ) {
      if ( !scale.domain ) {
        return {
          color: {
            ...colorEncoding,
            scale: {
              ...colorEncoding.scale,
              type: 'consistentOrdinal',
            },
          },
        }
      }
    }

   return {color: colorEncoding}
  }

  migrateObjects(visualization: Record<string, any>): any {
    return deepReplace(visualization, 'color', (key, value) => this.migrateColor(value))
  }

  getSchemaVersion(): string {
    return getSchemaId('0.44')
  }
}
