import { Layer } from '../layer/Layer'

export function isPickable(layer:Layer, isOnObjectEditor: boolean, 
                           isOnLayerEditor: boolean, lockedRowsetIds: string[]): boolean {
  if ( !layer.canInteract() ) return false

  if (isOnObjectEditor) {
    if ( lockedRowsetIds.includes(layer.getRowsetId()) ) {
      return false
    }    
  }

  // Fix attempt to solve room names over room polygons preventing polygon editing
  if ( layer.encoding.position?.isDataRef() && !layer.actions.hasObjectClickActions() && isOnObjectEditor) {
    return false
  }

  if ( layer.details?.enabled === false ) {
    if ( isOnLayerEditor || isOnObjectEditor ) {
      return true
    }

    return false
  }

  return true
}
