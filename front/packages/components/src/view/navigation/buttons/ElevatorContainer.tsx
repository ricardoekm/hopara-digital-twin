import {Dispatch} from '@reduxjs/toolkit'
import {Store} from '../../../state/Store'
import {connect} from '@hopara/state'
import {Floor} from '../../../floor/Floor'
import { ActionProps, Elevator, StateProps } from './Elevator'
import actions from '../../../state/Actions'
import { useMemo } from 'react'

export const mapState = (store: Store): StateProps => {
  const viewState = store.viewState
  const firstLayerWithFloor = store.layerStore.layers.getWithFloor().getVisibles(viewState?.zoom)[0]
  const currentFloor = firstLayerWithFloor || store.visualizationStore.isOnObjectEditor() ? store.floorStore.getCurrent() : undefined
  const floors = useMemo(() => store.floorStore.getFloors(), [store.floorStore.visualizationFloors, store.floorStore.dataFloors])
  const visualization = store.visualizationStore.visualization

  return {
    currentFloor,
    floors,
    visualization,
    isOnObjectEditor: store.visualizationStore.isOnObjectEditor(),
    showFloorSteps: !store.browser.isMobile(),
  }
}


export const mapActions = (dispatch: Dispatch, stateProps: StateProps): ActionProps => {
  return {
    onClick: (floor?: Floor) => {
      if (!floor) {
        return
      }

      if (!stateProps.visualization) throw new Error('Cannot change level while visualization does not exist')
      if (floor.id === stateProps.currentFloor?.id) return
      return dispatch(actions.navigation.floorChangeRequested({floor}))
    },
  }
}

export const ElevatorContainer = connect(mapState, mapActions)(Elevator as any)
