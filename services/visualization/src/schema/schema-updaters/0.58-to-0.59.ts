import { deepReplace } from 'gdeep-replace'
import {getSchemaId} from '../schema-repository.js'
import {BaseMigration} from './BaseMigration.js'

export class SchemaMigration058to059 extends BaseMigration {
  migrateActions(actions:any[]) {
    const newActions = actions.map((action) => {
      if (action.autoTrigger) {
        return {...action, trigger: 'OBJECT_CLICK'}
      } else {
        return action
      }
    })

    return {actions: newActions}
  }

  migrateLayers(layers: any[]): any {
    const newLayers = deepReplace(layers, 'actions', (key, value) => this.migrateActions(value))
    return {layers: newLayers}
  }

  migrateObjects(visualization: Record<string, any>): any {
    return deepReplace(visualization, 'layers', (key, value) => this.migrateLayers(value))
  }


  getSchemaVersion(): string {
    return getSchemaId('0.59')
  }
}
