import {Store} from '../../state/Store'
import {ActionProps, FloorEditorComponent, StateProps} from './FloorEditorComponent'
import {connect} from '@hopara/state'
import actions from '../../state/Actions'
import {Dispatch} from '@reduxjs/toolkit'

function mapState(state:Store) : StateProps {
  return {
    items: state.floorStore.visualizationFloors.immutableReverse(),
    selectedId: state.floorStore.selectedId,
  }
}

function mapActions(dispatch: Dispatch) : ActionProps {
  return {
    onChange: (id: string, name: string): void => {
      dispatch(actions.floor.nameChanged({id, name}))
    },

    onSelect: (id?: string): void => {
      dispatch(actions.floor.selected({id}))
    },

    onCreate: (): void => {
      dispatch(actions.floor.added())
    },

    onDelete: (id: string): void => {
      dispatch(actions.floor.deleted({id}))
    },

    onDragEnd: (sourceIndex: number, destinationIndex: number): void => {
      dispatch(actions.floor.reordered({sourceIndex, destinationIndex}))
    },
  }
}

export const FloorEditorContainer = connect(mapState, mapActions)(FloorEditorComponent)
