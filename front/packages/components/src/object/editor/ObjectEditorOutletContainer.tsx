import {Store} from '../../state/Store'
import {Dispatch} from '@reduxjs/toolkit'
import actions from '../../state/Actions'
import {PageNavigation} from '@hopara/page/src/PageNavigation'
import {connect} from '@hopara/state'
import {getInitialRouteParams} from '../../visualization/VisualizationRouteProvider'
import {ActionProps, ObjectEditorOutlet, StateProps} from './ObjectEditorOutlet'
import {MenuOption} from '@hopara/design-system/src/panel/PanelMenuItems'
import { PageType } from '@hopara/page/src/Pages'
import React from 'react'

const mapState = (state: Store): StateProps => {
  return {
    details: state.details,
    visualizationName: state.visualizationStore.visualization?.name,
    visualizationId: state.visualizationStore.visualization?.id,
    visualizationType: state.visualizationStore.visualization?.type,
    fallbackVisualizationId: state.visualizationStore.fallbackVisualizationId,
    authorization: state.auth.authorization,
    layers: state.layerStore.layers,
    menuItems: state.objectMenu.items,
    selectedMenuItemId: state.objectMenu.selectedId,
    imageHistoryLayerId: state.imageHistory.layerId,
    modelHistoryLayerId: state.modelHistory.layerId,
    menuLoading: state.objectMenu.loading,
    isCollapsed: !!state.details.isCollapsed,
  }
}

const mapActions = (dispatch: Dispatch, stateProps: StateProps, navigation: PageNavigation): ActionProps => {
  return {
    onMenuItemClick: (item: MenuOption) => {
      const selectedId = stateProps.selectedMenuItemId !== item.id ? item.id : undefined
      const layer = selectedId ? stateProps.layers.getById(selectedId) : undefined
      dispatch(actions.object.typeSelected({id: selectedId, rowsetId: layer?.getRowsetId()}))
    },
    onLoad: () => {
      dispatch(actions.objectEditor.pageLoaded({
        params: getInitialRouteParams(
          navigation.getLocation(),
          navigation.getRouteParams().visualizationId,
          stateProps.fallbackVisualizationId,
          navigation.getRouteParams().tenant,
        ),
        tenant: stateProps.authorization.tenant,
      }))
    },
    onCloseClick: () => {
      if (stateProps.imageHistoryLayerId) {
        dispatch(actions.details.imageHistoryCloseClicked())
      }
      if (stateProps.modelHistoryLayerId) {
        dispatch(actions.details.modelHistoryCloseClicked())
      }
      navigation.navigate(PageType.VisualizationDetail, navigation.getRouteParams())
    },
    onToggleCollapse: () => {
      if (stateProps.imageHistoryLayerId) {
        dispatch(actions.details.imageHistoryCloseClicked())
      }
      if (stateProps.modelHistoryLayerId) {
        dispatch(actions.details.modelHistoryCloseClicked())
      }
      dispatch(actions.details.toggleCollapse())
    },
    onExpandPanel: () => {
      dispatch(actions.details.setCollapsed(false))
    },
  }
}

// Novo componente wrapper para monitorar imageHistoryLayerId e expandir o painel
class ObjectEditorOutletAutoExpand extends React.PureComponent<StateProps & ActionProps> {
  componentDidUpdate(prevProps: StateProps) {
    const imageHistoryOpened =
      !prevProps.imageHistoryLayerId && this.props.imageHistoryLayerId
    const modelHistoryOpened =
      !prevProps.modelHistoryLayerId && this.props.modelHistoryLayerId
    if (imageHistoryOpened || modelHistoryOpened) {
      this.props.onExpandPanel && this.props.onExpandPanel()
    }
  }

  render() {
    return <ObjectEditorOutlet {...this.props} />
  }
}

export default connect(mapState, mapActions)(ObjectEditorOutletAutoExpand)
