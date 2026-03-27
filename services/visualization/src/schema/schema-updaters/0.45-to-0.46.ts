import {getSchemaId} from '../schema-repository.js'
import {BaseMigration} from './BaseMigration.js'

export class SchemaMigration045to046 extends BaseMigration {
  createMapLayer(mapStyle:string) {
    return {
      id: 'map-layer-migration',
      name: 'Map',
      type: 'map',
      encoding: {
        map: {
          value: mapStyle,
        },
      },
    }
  }

  migrateObjects(visualization: Record<string, any>): any {
    if (visualization.type !== 'GEO') return visualization
    const existingMapLayer = visualization.layers.find((l) => l.type === 'map')
    if ( existingMapLayer ) {
      return visualization
    }

    visualization.layers.unshift(this.createMapLayer(visualization.mapStyle))
    return visualization
  }

  getSchemaVersion(): string {
    return getSchemaId('0.46')
  }
}
