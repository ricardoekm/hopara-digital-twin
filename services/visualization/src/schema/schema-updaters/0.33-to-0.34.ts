import { deepReplace } from 'gdeep-replace'
import {getSchemaId} from '../schema-repository.js'
import {BaseMigration} from './BaseMigration.js'
import first from 'lodash/fp/first.js'

export class SchemaMigration033to034 extends BaseMigration {
  getTransformType(transform:any) {
    return first(Object.keys(transform))
  }

  migrateLayers(oldLayers: any): any {
    const newLayers = oldLayers.map((layer: any) => {
      if ( !layer.data || !layer.transform ) {
        return layer
      }

      const newLayer = {...layer}
      const transformType = this.getTransformType(layer.transform)
      if ( transformType ) {
        newLayer.data.transform = {
          type: transformType,
          ...layer.transform[transformType],
        }
      }
      delete newLayer.transform
      return newLayer
    })
    return {layers: newLayers}
  }

  migrateObjects(visualization: Record<string, any>): any {
    return deepReplace(visualization, 'layers', (key, value) => this.migrateLayers(value))
  }


  getSchemaVersion(): string {
    return getSchemaId('0.34')
  }
}
