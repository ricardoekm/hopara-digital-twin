import {VisualizationViewLoadedPayload} from '../../visualization/state/VisualizationActions'
import { createAction } from 'typesafe-actions'

export const layerEditorActions = {
  pageLoaded: createAction('LAYER_EDITOR_PAGE_LOADED')<VisualizationViewLoadedPayload>(),
}
