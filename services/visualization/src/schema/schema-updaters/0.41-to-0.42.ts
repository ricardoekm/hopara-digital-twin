import {deepReplace} from 'gdeep-replace'
import {getSchemaId} from '../schema-repository.js'
import {BaseMigration} from './BaseMigration.js'

export class SchemaMigration041to042 extends BaseMigration {
  migrateZoom(zoom:any) {
    if ( !zoom ) {
      return
    }

    return {
      field: zoom.relative?.bounds?.field,
      padding: zoom.relative?.bounds?.padding,
      increment: zoom.relative?.increment,
      value: zoom.fixed?.value,
    }
  }
  
  migrateZoomAction(zoomAction:any) {
    return {...zoomAction, zoom: this.migrateZoom(zoomAction.zoom)}
  }
  
  migrateActions(actions: any): any {
    const migratedActions = actions.map( (action) => {
      if ( action.type === 'ZOOM_JUMP' ) {
        return this.migrateZoomAction(action)
      }

      return action
    })

    return {actions: migratedActions}
  }

  migrateZoomRange(zoomRange:any) {
    const newZoomRange = {} as any
    if ( zoomRange.max ) {
      newZoomRange.max = this.migrateZoom(zoomRange.max)
    }

    if ( zoomRange.min ) {
      newZoomRange.min = this.migrateZoom(zoomRange.min)
    }

    return {zoomRange: newZoomRange}
  }

  migrateObjects(visualization: Record<string, any>): any {
    const migrated = deepReplace(visualization, 'actions', (key, value) => this.migrateActions(value))
    return deepReplace(migrated, 'zoomRange', (key, value) => this.migrateZoomRange(value))
  }


  getSchemaVersion(): string {
    return getSchemaId('0.42')
  }
}
