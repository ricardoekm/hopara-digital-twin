import React from 'react'
import {Store} from '../state/Store'
import {Dispatch} from '@reduxjs/toolkit'
import actions from '../state/Actions'
import {PageNavigation} from '@hopara/page/src/PageNavigation'
import {PageType} from '@hopara/page/src/Pages'
import {connect} from '@hopara/state'
import {getRouteParams} from '../view/navigation/LeftNavigationContainer'
import {VisualizationEditStatus} from './VisualizationEditStatus'
import {Authorization} from '@hopara/authorization'
import Visualization from './Visualization'
import {PureComponent} from '@hopara/design-system'
import {Icon} from '@hopara/design-system/src/icons/Icon'
import {PanelButton} from '@hopara/design-system/src/buttons/PanelButton'

interface StateProps {
  isDirty: boolean
  visualization: Visualization
  authorization: Authorization
  isOnViewerMode: boolean
}

interface ActionProps {
  onCloseClick: () => void
}

const mapState = (state: Store): StateProps => {
  return {
    isDirty: state.visualizationStore.editStatus === VisualizationEditStatus.DIRTY,
    visualization: state.visualizationStore.visualization,
    authorization: state.auth.authorization,
    isOnViewerMode: state.visualizationStore.isOnViewerMode(),
  }
}

const mapActions = (dispatch: Dispatch, stateProps: StateProps, navigation: PageNavigation): ActionProps => {
  return {
    onCloseClick: () => {
      if (stateProps.isDirty) {
        dispatch(actions.visualization.editorDirtyExitClicked())
      } else if (stateProps.isOnViewerMode) {
        dispatch(actions.visualization.panelCloseClicked())
      } else {
        navigation.navigate(
          PageType.VisualizationDetail,
          getRouteParams(stateProps),
        )
      }
    },
  }
}

export class CloseEditor extends PureComponent<StateProps & ActionProps> {
  render() {
    return (
      <PanelButton onClick={this.props.onCloseClick}>
        <Icon icon="color-legend-close"/>
      </PanelButton>
    )
  }
}

export const CloseEditorButtonContainer = connect(mapState, mapActions)(CloseEditor)
