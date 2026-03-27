import {Store} from '../state/Store'
import {Action} from './Action'
import actions from '../state/Actions'
import {ActionProps, ActionsComponent, StateProps} from './ActionsComponent'
import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import {SelectOption} from '@hopara/design-system/src'

function mapState(state: Store): StateProps {
  const visualization = state.visualizationStore.visualization
  const selectedActionId = state.visualizationStore.selectedActionId
  return {
    visualization,
    visualizations: state.visualizations,
    selectedAction: visualization?.actions.find((a) => a.id === selectedActionId),
    zoom: state.viewState?.zoom ?? 0,
    maxZoom: state.viewState?.zoomRange?.getMax() ?? 0,
    minZoom: state.viewState?.zoomRange?.getMin() ?? 0,
    filterOptions: state.visualizationFilters.filters.map((filter) => {
      return {value: filter.field, label: filter.field}
    }) as any as SelectOption[],
    filterStatus: state.visualizationFilters.state,
  }
}

function mapActions(dispatch: Dispatch): ActionProps {
  return {
    onSubItemClick: (actionId?: string) => {
      dispatch(actions.visualization.actionSelected({actionId}))
    },
    onItemChange: (item: Action) => {
      dispatch(actions.visualization.actionChanged({action: item}))
    },
    onMove: ({sourceIndex, destinationIndex}) => {
      dispatch(actions.visualization.actionMoved({sourceIndex, destinationIndex}))
    },
    newActionClick: () => {
      dispatch(actions.visualization.newActionRequested())
    },
    onDelete: (actionId: string) => {
      dispatch(actions.visualization.actionDeleted({actionId}))
    },
    onVisualizationChanged: (visualization: string) => {
      dispatch(actions.action.visualizationChanged({visualization}))
    },
  }
}

export const ActionsContainer = connect(mapState, mapActions)(ActionsComponent)
