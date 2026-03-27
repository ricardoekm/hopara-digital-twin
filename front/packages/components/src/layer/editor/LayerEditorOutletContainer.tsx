import {Store} from '../../state/Store'
import {Dispatch} from '@reduxjs/toolkit'
import actions from '../../state/Actions'
import {PageNavigation} from '@hopara/page/src/PageNavigation'
import {connect} from '@hopara/state'
import { getInitialRouteParams } from '../../visualization/VisualizationRouteProvider'
import { ActionProps, StateProps, LayerEditorOutlet } from './LayerEditorOutlet'

const mapState = (state: Store): StateProps => {
  return {
    details: state.details,
    visualizationName: state.visualizationStore.visualization?.name,
    visualizationId: state.visualizationStore.visualization?.id,
    fallbackVisualizationId: state.visualizationStore.fallbackVisualizationId,
    authorization: state.auth.authorization,
    layers: state.layerStore.layers,
    visualizationStatus: state.visualizationStore.editStatus,
    exitDestination: state.visualizationStore.exitDestination,
  }
}

const mapActions = (dispatch: Dispatch, stateProps: StateProps, navigation: PageNavigation): ActionProps => {
  return {
    onLoad: () => {
      dispatch(actions.layerEditor.pageLoaded({
        params: getInitialRouteParams(
          navigation.getLocation(),
          navigation.getRouteParams().visualizationId,
          stateProps.fallbackVisualizationId,
          navigation.getRouteParams().tenant,
        ),
        tenant: stateProps.authorization.tenant,
      }))
    },
  }
}

export default connect(mapState, mapActions)(LayerEditorOutlet)
