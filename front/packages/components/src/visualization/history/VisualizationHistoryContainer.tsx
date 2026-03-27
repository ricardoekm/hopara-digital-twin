import actions from '../../state/Actions'
import {Store} from '../../state/Store'
import Visualization from '../Visualization'
import {Dispatch} from '@reduxjs/toolkit'
import {HistoryStatus} from './store/VisualizationHistoryStore'
import { connect } from '@hopara/state'
import {ActionProps, VisualizationHistoryComponent, StateProps} from './VisualizationHistoryComponent'

function mapState(state: Store): StateProps {
  return {
    visualization: state.visualizationStore.visualization as Visualization,
    loading: state.history.status === HistoryStatus.LOADING,
    history: state.history.history,
    currentVersion: state.history.currentVersion,
    authorization: state.auth.authorization,
    fallbackVisualizationId: state.visualizationStore.fallbackVisualizationId,
  }
}

function mapAction(dispatch: Dispatch, stateProps: StateProps): ActionProps {
  return {
    onCheckoutVersion(version?: number): void {
      dispatch(actions.visualizationHistory.checkoutVersion({
        visualizationId: stateProps.visualization.id, version,
      }))
    },
    onBackClick(): void {
      dispatch(actions.visualizationHistory.close())
    },
  }
}

export const VisualizationHistoryContainer = connect(mapState, mapAction)(VisualizationHistoryComponent)
