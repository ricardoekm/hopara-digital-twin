import {Store} from '../state/Store'
import {Dispatch} from '@reduxjs/toolkit'
import actions from '../state/Actions'
import {PageNavigation} from '@hopara/page/src/PageNavigation'
import {connect} from '@hopara/state'
import { getInitialRouteParams } from '../visualization/VisualizationRouteProvider'
import { ActionProps, StateProps, SettingsOutlet } from './SettingsOutlet'
import { MenuOption } from '@hopara/design-system/src/panel/PanelMenuItems'
import {HistoryStatus} from '../visualization/history/store/VisualizationHistoryStore'

const mapState = (state: Store): StateProps => {
  return {
    details: state.details,
    visualizationName: state.visualizationStore.visualization?.name,
    visualizationId: state.visualizationStore.visualization?.id,
    fallbackVisualizationId: state.visualizationStore.fallbackVisualizationId,
    authorization: state.auth.authorization,
    layers: state.layerStore.layers,
    visualizationStatus: state.visualizationStore.editStatus,
    menuItems: state.settingsMenu.items,
    selectedMenuItemId: state.settingsMenu.selectedId,
    historyOpen: state.history.status !== HistoryStatus.CLOSED,
    exitDestination: state.visualizationStore.exitDestination,
  }
}

const mapActions = (dispatch: Dispatch, stateProps: StateProps, navigation: PageNavigation): ActionProps => {
  return {
    onMenuItemClick: (item: MenuOption) => {
      dispatch(actions.settings.itemSelected({id: item.id}))
    },
    onLoad: () => {
      dispatch(actions.settings.pageLoaded({
        params: getInitialRouteParams(
          navigation.getLocation(),
          navigation.getRouteParams().visualizationId,
          stateProps.fallbackVisualizationId,
          navigation.getRouteParams().tenant,
        ),
        tenant: stateProps.authorization.tenant,
      }))
    },
    onHistoryClick: () => {
      dispatch(actions.visualizationHistory.open())
    },
  }
}

export default connect(mapState, mapActions)(SettingsOutlet)
