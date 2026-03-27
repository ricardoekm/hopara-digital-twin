import {Dispatch} from '@reduxjs/toolkit'
import {Store} from '../../state/Store'
import actions from '../../state/Actions'
import {i18n} from '@hopara/i18n'
import {PageNavigation} from '@hopara/page/src/PageNavigation'
import {PageType} from '@hopara/page/src/Pages'
import {connect} from '@hopara/state'
import {ActionProps, LeftNavigationComponent, StateProps} from './LeftNavigationComponent'
import Visualization from '../../visualization/Visualization'
import {Authorization} from '@hopara/authorization'
import {VisualizationEditStatus} from '../../visualization/VisualizationEditStatus'

export const getRouteParams = (stateProps: { visualization?: Visualization, authorization?: Authorization }) => {
  return {
    visualizationId: stateProps.visualization?.id,
    tenant: stateProps.authorization!.tenant,
  }
}

export const mapState = (store: Store, _, navigation: PageNavigation): StateProps => {
  const visualization = store.visualizationStore.visualization
  const viewState = store.viewState
  const firstLayerWithFloor = store.layerStore.layers.getWithFloor().getVisibles(viewState?.zoom)[0]
  const currentFloor = firstLayerWithFloor || store.visualizationStore.isOnObjectEditor() ? store.floorStore.getCurrent() : undefined
  const visualizationsListLink = navigation.getUrl(PageType.ListVisualizations, {tenant: store.auth.authorization.tenant})
  let settingsLink
  let layerEditorLink

  if (visualization?.id) {
    settingsLink = navigation.getUrl(PageType.VisualizationSettings, getRouteParams({
      visualization,
      authorization: store.auth.authorization,
    }), {hard: true})
    layerEditorLink = navigation.getUrl(PageType.VisualizationLayerEditor, getRouteParams({
      visualization,
      authorization: store.auth.authorization,
    }), {hard: true})
  }
  const hasSelectedFilters = !!store.filterStore.hasVisibleSelectedFilters()

  return {
    visualization,
    currentFloor,
    authorization: store.auth.authorization,
    jumpedVisualization: store.jump.history.getPreviousVisualization(),
    isJumping: store.jump.history?.isJumping(),
    hasFilters: !!store.filterStore.filters.length,
    fallbackVisualizationId: store.visualizationStore.fallbackVisualizationId,
    selectedFilters: store.filterStore.selectedFilters,
    isOnViewerMode: store.visualizationStore.isOnViewerMode(),
    isOnObjectEditor: store.visualizationStore.isOnObjectEditor(),
    isOnSettings: store.visualizationStore.isOnSettings(),
    isOnLayerEditor: store.visualizationStore.isOnLayerEditor(),
    isOnFilters: store.filterStore.activated,
    settingsLink,
    layerEditorLink,
    visualizationsListLink,
    hasSelectedFilters,
    visible: store.navigation.visible,
    isEditingDirtyVisualization: store.visualizationStore.editStatus === VisualizationEditStatus.DIRTY,
    canNavigateBack: !!store.visualizationStore.visualization?.historyBack && !!window?.history?.length,
  }
}


export const mapActions = (dispatch: Dispatch, stateProps: StateProps, navigation: PageNavigation): ActionProps => {
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
    onJumpBackClick: () => {
      const basePath = `/${stateProps.authorization.tenant}/visualization/${stateProps.jumpedVisualization?.visualizationId}`
      const params = new URLSearchParams()

      if (stateProps.jumpedVisualization?.fallbackVisualizationId) {
        params.set('fallbackVisualizationId', stateProps.jumpedVisualization.fallbackVisualizationId)
      }

      navigation.urlNavigate(`${basePath}${params.toString() ? '?' + params.toString() : ''}`, {
        replace: false,
        state: {routeParams: navigation.getRouteParams()},
      })
    },
    onFiltersClick: () => {
      if (stateProps.isEditingDirtyVisualization) {
        return dispatch(actions.navigation.dirtyGoToFiltersClicked())
      }

      dispatch(actions.navigation.filtersClicked())
      if (!stateProps.isOnViewerMode) navigation.navigate(PageType.VisualizationDetail, getRouteParams(stateProps))
    },
    onGoToObjectEditorClick: () => {
      if (stateProps.isEditingDirtyVisualization) {
        return dispatch(actions.navigation.dirtyGoToObjectEditorClicked())
      }
      if (stateProps.isOnObjectEditor) {
        return navigation.navigate(PageType.VisualizationDetail, getRouteParams(stateProps))
      }
      navigation.navigate(
        PageType.VisualizationObjectEditor,
        getRouteParams(stateProps),
      )
    },
    onGoToSettingsClick: (event) => {
      event.preventDefault()
      event.stopPropagation()
      if (stateProps.isEditingDirtyVisualization) {
        return dispatch(actions.navigation.dirtyGoToSettingsClicked())
      }
      if (stateProps.isOnSettings) {
        return navigation.navigate(PageType.VisualizationDetail, getRouteParams(stateProps))
      }
      return navigation.navigate(
        PageType.VisualizationSettings,
        getRouteParams(stateProps),
      )
    },
    onGoToLayerEditorClick: (event) => {
      event.preventDefault()
      event.stopPropagation()
      if (stateProps.isEditingDirtyVisualization) {
        return dispatch(actions.navigation.dirtyGoToLayerEditorClicked())
      }
      if (stateProps.isOnLayerEditor) {
        return navigation.navigate(PageType.VisualizationDetail, getRouteParams(stateProps))
      }
      return navigation.navigate(
        PageType.VisualizationLayerEditor,
        getRouteParams(stateProps),
      )
    },
    onVisualizationListClick: (event: any) => {
      if (!event.metaKey && stateProps.isEditingDirtyVisualization) {
        event.preventDefault()
        event.stopPropagation()
        return dispatch(actions.navigation.dirtyGoToVisualizationListClicked())
      }
    },
    onHistoryBackClick: (event: any) => {
      event.preventDefault()
      event.stopPropagation()
      if (window.history) window.history.back()
    },
  }
}

export const LeftNavigationContainer = connect(mapState, mapActions)(LeftNavigationComponent)
