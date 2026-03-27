import {getType} from 'typesafe-actions'
import actions, {ActionTypes} from '../state/Actions'
import {isNil} from 'lodash/fp'
import {FloorContext, FloorStore} from './FloorStore'
import {Floor} from './Floor'
import { Reducer } from '@hopara/state'

export const floorReducer: Reducer<FloorStore, ActionTypes> = (state = new FloorStore(), action): FloorStore => {
  switch (action.type) {
    case getType(actions.settings.pageLoaded):
    case getType(actions.objectEditor.pageLoaded):
      return state.setContext(FloorContext.ALL)
                  .updateCurrent()
    case getType(actions.floor.changed):
      return state.resetChanged()
    case getType(actions.object.placed):
      // To handle the scenario of floors just created and with items placed, so we don't need to invalidate the rowset
      if (state.getCurrent()) {
        return state.addDataFloor(state.getCurrent() as Floor)
      }

      return state
    case getType(actions.visualization.pageLoaded):
    case getType(actions.layerEditor.pageLoaded):
      return state.setContext(FloorContext.LAYER)
                  .updateCurrent()
    case getType(actions.floor.floorFetched):
      return state.setDataFloors(action.payload.dataFloors)
                  .setVisualizationFloors(action.payload.visualizationFloors)
                  .updateCurrent()
    case getType(actions.navigation.floorChangeRequested):
      return state.setCurrent(action.payload.floor)
                  .resetChanged()
    case getType(actions.navigation.searchRowClicked):
    case getType(actions.object.click):
    case getType(actions.object.navigateTo):
    case getType(actions.object.navigateToInitialRow): {
      const floorName = action.payload.row.getCoordinates()?.getFloorName()
      if (!isNil(floorName)) return state.setCurrent(new Floor({name: floorName}))
      return state
    }
    case getType(actions.visualization.fetch.success):
    case getType(actions.visualization.refreshed):
    case getType(actions.visualization.fetch.failure): {
      const newState = state
        .setVisualizationFloors(action.payload.floors ?? [])
        .updateCurrent()
      if (!isNil(action.payload.floor)) return newState.setCurrent(action.payload.floor)
      return newState
    }
    case getType(actions.floor.selected):
      return state.setSelected(action.payload.id)
    case getType(actions.floor.added):
      return state.add()
    case getType(actions.floor.deleted):
      return state.delete(action.payload.id)
    case getType(actions.floor.reordered):
      return state.reorder(action.payload.sourceIndex, action.payload.destinationIndex)
    case getType(actions.floor.nameChanged):
      return state.changeName(action.payload.id, action.payload.name)
    default:
      return state
  }
}
