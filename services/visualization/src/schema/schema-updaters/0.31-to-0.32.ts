import {getSchemaId} from '../schema-repository.js'
import {BaseMigration} from './BaseMigration.js'

export class SchemaMigration031to032 extends BaseMigration {
  migrateObjects(visualization: Record<string, any>): any {
    visualization.layers = (visualization.layers ?? []).map((layer) => {
      layer.actions = (layer.actions ?? []).map((action) => {
        if (action.type === 'VISUALIZATION_JUMP') {
          if (!action.visualization) {
            action.visualization = action.app
          }
          delete action.app
        }
        return action
      })
      return layer
    })
    return visualization
  }

  getSchemaVersion(): string {
    return getSchemaId('0.32')
  }
}
