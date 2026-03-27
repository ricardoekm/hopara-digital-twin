import actions, {ActionTypes} from '../../state/Actions'
import {getType} from 'typesafe-actions'
import Tooltip from '../domain/TooltipModel'
import {Reducer} from '@hopara/state'
import {Layer} from '../../layer/Layer'

export const tooltipReducer: Reducer<Tooltip | undefined, ActionTypes> = (state, action, globalState) => {
  switch (action.type) {
    case getType(actions.view.viewZooming):
      return
    case getType(actions.details.zoomRequested):
      return
    case getType(actions.viewLayer.mouseHover): {
      if (globalState.visualizationStore.isOnObjectEditor()) return
      const layer = globalState.layerStore.layers.getById(action.payload.layerId) as Layer
      if (!layer?.details.tooltip) return

      if (layer?.actions.hasObjectHoverActions()) {
        return
      }

      return new Tooltip({
        layerId: action.payload.layerId,
        row: action.payload.row,
        coordinates: action.payload.pixel,
        rowsetId: action.payload.rowsetId,
      })
    }
    case getType(actions.viewLayer.mouseLeft):
      return
    default:
      return state
  }
}

