import {createAction} from 'typesafe-actions'
import {VisualizationViewLoadedPayload} from '../../../visualization/state/VisualizationActions'
import { MapStyle} from '@hopara/encoding'

type MapStyleChangedPayload = {
  mapStyle: MapStyle
}

export interface ObjectTabLoadPayload {
  rowsetId: string
  pageSize: number
}

export const objectEditorActions = {
  pageLoaded: createAction('OBJECT_EDITOR_LOAD')<VisualizationViewLoadedPayload>(),
  mapStyleChanged: createAction('MAP_STYLE_CHANGED')<MapStyleChangedPayload>(),
  lockToggleRequested: createAction('OBJECT_EDITOR_LOCK_TOGGLE_REQUESTED')<{ layerId: string }>(),
  lockOtherLayersRequested: createAction('OBJECT_EDITOR_LOCK_OTHER_LAYERS_REQUESTED')<{ layerId: string }>(),
  unlockOtherLayersRequested: createAction('OBJECT_EDITOR_UNLOCK_OTHER_LAYERS_REQUESTED')<{ layerId: string }>(),
  itemCloseClicked: createAction('OBJECT_EDITOR_ITEM_CLOSE_CLICKED')<void>(),
  itemTabChanged: createAction('OBJECT_EDITOR_ITEM_TAB_CHANGED')<{ tabIndex: number }>(),
}
