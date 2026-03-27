import {Dispatch} from '@reduxjs/toolkit'
import {Store} from '../../state/Store'
import {ActionProps, NavigationComponent, StateProps} from './NavigationComponent'
import actions from '../../state/Actions'
import {i18n} from '@hopara/i18n'
import {connect} from '@hopara/state'
import {MapStyle} from '@hopara/encoding'
import {PageType} from '@hopara/page/src/Pages'
import {VisualizationEditStatus} from '../../visualization/VisualizationEditStatus'
import {PageNavigation} from '@hopara/page/src/PageNavigation'

export const mapState = (store: Store, _, navigation: PageNavigation): StateProps => {
  const visualization = store.visualizationStore.visualization
  const isRotateMode = !!store.viewController?.isRotateMode()
  const fullScreen = store.visualizationStore.isFullScreen
  const visualizationsListLink = navigation.getUrl(PageType.ListVisualizations, {tenant: store.auth.authorization.tenant})
  const isEditingDirtyVisualization = store.visualizationStore.editStatus === VisualizationEditStatus.DIRTY

  return {
    visualization,
    authorization: store.auth.authorization,
    isOnObjectEditor: store.visualizationStore.isOnObjectEditor(),
    isRotateMode,
    fullScreen,
    visualizationsListLink,
    isEditingDirtyVisualization,
    visible: store.navigation.visible,
    isAutoRotateEnabled: !!store.viewState?.autoRotate,
    isAutoNavigationEnabled: !!store.viewState?.autoNavigate,
    showZoomButtons: !store.browser.isMobile(),
    showAutoNavigateButton: !!visualization?.autoNavigation,
    rotation: {x: store.viewState?.rotationX ?? 0, y: store.viewState?.rotationOrbit ?? 0}
  }
}


export const mapActions = (dispatch: Dispatch, stateProps: StateProps): ActionProps => {
  return {
    onZoomInClick: (): void => {
      if (!stateProps.visualization) {
        dispatch(actions.log.genericError({reason: i18n('CANNOT_ZOOM_WHILE_VISUALIZATION_DOES_NOT_EXIST')}))
        return
      }
      dispatch(actions.navigation.zoomInRequested({}))
    },
    onZoomOutClick: (): void => {
      if (!stateProps.visualization) {
        dispatch(actions.log.genericError({reason: i18n('CANNOT_ZOOM_WHILE_VISUALIZATION_DOES_NOT_EXIST')}))
        return
      }
      dispatch(actions.navigation.zoomOutRequested({}))
    },
    onBearingModeClick: () => {
      if (!stateProps.visualization) throw new Error(i18n('CANNOT_CHANGE_BEARING_WHILE_VISUALIZATION_DOES_NOT_EXIST'))

      return dispatch(actions.navigation.bearingModeToggle({}))
    },
    onInitialPositionClick: () => {
      dispatch(actions.navigation.initialPositionRequested())
    },
    onMapStyleClick: (mapStyle: MapStyle) => {
      dispatch(actions.objectEditor.mapStyleChanged({
        mapStyle,
      }))
    },
    onFullScreenClick: () => {
      dispatch(actions.visualization.fullScreenRequested({fullScreen: true}))
    },
    onAutoRotateClick: () => {
      if (stateProps.isAutoRotateEnabled) {
        return dispatch(actions.navigation.stopAutoRotateClicked())
      }
      dispatch(actions.navigation.startAutoRotateClicked())
    },
    onAutoNavigateClick: () => {
      if (stateProps.isAutoNavigationEnabled) {
        return dispatch(actions.navigation.stopAutoNavigateClicked())
      }
      dispatch(actions.navigation.startAutoNavigateClicked())
    },
    onRotationChange: (rotationX: number, rotationY: number): void => {
      dispatch(actions.navigation.onViewCubeRotationChange({rotationX, rotationY}))
    }
  }
}

export const NavigationContainer = connect(mapState, mapActions)(NavigationComponent as any)
