import {createAction} from 'typesafe-actions'

export const layerHelperActions = {
  initialized: createAction('LAYER_HELPER_INITIALIZED')<any>(),
  onHelperDismissed: createAction('LAYER_HELPER_ON_HELPER_DISMISSED')<{layerId: string}>(),
  onHelperLoaded: createAction('LAYER_HELPER_ON_HELPER_LOADED')<{layerId: string}>(),
}

