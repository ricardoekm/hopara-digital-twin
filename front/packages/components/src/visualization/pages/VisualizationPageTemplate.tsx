import {Store} from '../../state/Store'
import {connect} from '@hopara/state'
import actions from '../../state/Actions'
import {ActionProps, StateProps, VisualizationPageComponent} from './VisualizationPageComponent'
import {Area} from './Area'
import {PageNavigation} from '@hopara/page/src/PageNavigation'
import {PageType} from '@hopara/page/src/Pages'

const mapState = (state: Store): StateProps => {
  // TODO: verify all advanced modes (advancedModeArea???)
  const isAdvancedMode = state.layerStore.isAdvancedMode
  const hasPanelOpened = !state.visualizationStore.isOnViewerMode() || !!state.details.row || state.filterStore.activated

  return {
    authorization: state.auth.authorization,
    visualizationName: state.visualizationStore.visualization?.getName(),
    fullScreen: state.visualizationStore.isFullScreen,
    area: state.visualizationStore.area,
    hasRow: !!state.details.row,
    isAdvancedMode,
    layer: state.layerStore.getSelectedLayer(),
    visualizationStatus: state.visualizationStore.editStatus,
    exitDestination: state.visualizationStore.exitDestination,
    hasPanelOpened,
    isPanelCollapsed: !!state.details.isCollapsed,
  }
}

const getExitPageType = (currentArea: Area, exitDestination?: Area): PageType => {
  if (currentArea === exitDestination) return PageType.VisualizationDetail
  if (exitDestination === Area.OBJECT_EDITOR) return PageType.VisualizationObjectEditor
  if (exitDestination === Area.VISUALIZATION_LIST) return PageType.ListVisualizations
  if (exitDestination === Area.SETTINGS) return PageType.VisualizationSettings
  if (exitDestination === Area.LAYER_EDITOR) return PageType.VisualizationLayerEditor
  return PageType.VisualizationDetail
}

function mapActions(dispatch: any, stateProps: StateProps, navigation: PageNavigation): ActionProps {
  const exitNavigate = () => {
    navigation.navigate(
      getExitPageType(stateProps.area, stateProps.exitDestination),
      stateProps.exitDestination === Area.VISUALIZATION_LIST ? undefined : navigation.getRouteParams(),
      {hard: stateProps.exitDestination === Area.VISUALIZATION_LIST},
    )
  }
  return {
    onDiscardClick: exitNavigate,
    onCancelClick: () => dispatch(actions.visualization.dismissExitClicked()),
    onSaveClick: () => {
      dispatch(actions.visualization.save.request())
      exitNavigate()
    },
    onFullScreenExit: () => dispatch(actions.visualization.fullScreenRequested({fullScreen: false})),
  }
}

export default connect(mapState, mapActions)(VisualizationPageComponent)
