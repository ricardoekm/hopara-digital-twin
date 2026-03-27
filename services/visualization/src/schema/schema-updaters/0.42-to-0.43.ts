import {deepReplace} from 'gdeep-replace'
import {getSchemaId} from '../schema-repository.js'
import {BaseMigration} from './BaseMigration.js'

export class SchemaMigration042to043 extends BaseMigration {
  migrateField(fieldValue:string) {
    if ( fieldValue === 'coordinates' ) {
      return { field: 'room_coordinates' }
    } else if ( fieldValue === 'group' ) {
      return { field: 'item_group' }
    }

    return { field: fieldValue }
  }

  migrateTransform(transform:any) {
    return {
      type: transform.type,
      cellSize: transform.cellSize,
      roomCoordinates: transform.coordinates,
      itemGroup: transform.group,
    }
  }

  migrateLayer(layer: any): any {
    const transform = layer?.data?.transform
    if ( transform?.type === 'roomCluster' ) {
      return { ...deepReplace(layer, 'field', (key, value) => this.migrateField(value)),
                  data: {
                    ...layer.data,
                    transform: this.migrateTransform(transform) }, 
             }
    }

    return layer
  }

  migrateLayers(layers:any) {
   const newLayers = layers.map((layer) => this.migrateLayer(layer))
   return {layers: newLayers}
  }

  migrateObjects(visualization: Record<string, any>): any {
    return deepReplace(visualization, 'layers', (key, value) => this.migrateLayers(value))
  }

  getSchemaVersion(): string {
    return getSchemaId('0.43')
  }
}
