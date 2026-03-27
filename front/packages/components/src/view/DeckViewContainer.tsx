import { isEqual } from 'lodash/fp'
import rootActions from '../state/Actions'
import actions from '../state/Actions'
import {Store} from '../state/Store'
import ViewState, {getCenterOfTheWorldCoordinates} from '../view-state/ViewState'
import {StateProps, ActionProps} from './DeckView'
import { DetailsInteractionInfo, InteractionInfo } from '../view-layer/deck/interaction/Interaction'
import { AxesDimensions } from '../chart/domain/AxesDimension'
import { Projector } from '@hopara/projector'
import OrbitViewport from './deck/OrbitViewport'
import { OrthographicViewport } from './deck/OrthographicViewport'
import WebMercatorViewport from './deck/WebMercatorViewport'
import { Dimensions } from '@hopara/spatial'
import {Dispatch} from '@reduxjs/toolkit'
import React from 'react'
import {useTheme} from '@hopara/design-system/src'
import {ResourceType} from '@hopara/resource'
import { MAIN_VIEW_ELM_ID } from './View'
import Visualization from '../visualization/Visualization'
import { PageNavigation } from '@hopara/page/src/PageNavigation'

const getFixedDimensions = (dimensions: Dimensions, visualization: Visualization): Dimensions => {
  const viewHTMLElement = window && window.document && window.document.getElementById(MAIN_VIEW_ELM_ID)
  if (!visualization.isWhiteboard() || !viewHTMLElement) return dimensions

  const viewRect = viewHTMLElement.getBoundingClientRect()
  return {
    width: dimensions.width + viewRect.x,
    height: dimensions.height + viewRect.y,
  }
}

export function mapState(state:Store) : StateProps {
  const theme = useTheme()
  const layers = React.useMemo(() => state.layerStore.getAllLayers(), [[state.layerStore.layers, state.layerStore.previewLayer, state.layerStore.userLocationLayers]]) 
  const rowSelection = state.viewLayers.rowSelection
  const rowCrop = state.viewLayers.crop
  const lockedRowsetIds = React.useMemo(() => state.layerStore.layers.getLockeds().map((layer) => layer.getRowsetId()), [state.layerStore.layers])
  const hasGoogleMapLayer = React.useMemo(() => layers.hasGoogleMapLayer(), [layers])

  return {
    authorization: state.auth.authorization,
    axesDimensions: state.chart.dimensions,
    queries: state.queryStore.queries,
    rowsetStore: state.rowsetStore,
    resourceUploadState: state.resource.upload,
    resourceGenerateState: state.resource.generate,
    viewController: state.viewController,
    webGLMaxTextureSize: state.browser.webGL.maxTextureSize,
    lockedRowsetIds,
    editingMode: state.viewLayers.editingMode,
    viewState: state.viewState,
    world: state.world,
    visualization: state.visualizationStore.visualization,
    imageHistory: state.imageHistory,
    modelHistory: state.modelHistory,
    rowSelection,
    layers,
    isOnObjectEditor: state.visualizationStore.isOnObjectEditor(),
    isOnLayerEditor: state.visualizationStore.isOnLayerEditor(),
    isOnSettingsEditor: state.visualizationStore.isOnSettings(),
    editAccentColor: theme.palette.spec.editAccentColor,
    mapStyle: state.visualizationStore.isOnObjectEditor() ? state.objectEditor.mapStyle : undefined,
    rowCrop,
    lights: state.visualizationStore.visualization.lights,
    hasGoogleMapLayer,
    grids: state.grid,
  }
}

export function mapActions(dispatch: Dispatch, props: StateProps, navigation: PageNavigation) : ActionProps {
  return {
    onLayerHover: (info?: DetailsInteractionInfo): void => {
      if (!info?.row) {
        dispatch(actions.viewLayer.mouseLeft({navigation}))
        return
      }
  
      dispatch(actions.viewLayer.mouseHover({
        layerId: info.layerId,
        parentId: info.parentId,
        pixel: info.pixel,
        row: info.row,
        rowsetId: info.rowsetId,
        navigation
      }))
    },
  
    onLayerClick: (info?: DetailsInteractionInfo): void => {
      if (!info?.row) {
        dispatch(actions.viewLayer.clickOut())
        return
      }
  
      dispatch(actions.viewLayer.click({
        layerId: info.layerId,
        parentId: info.parentId,
        pixel: info.pixel,
        row: info.row,
        rowsetId: info.rowsetId,
        navigation,
      }))
    },
  
    onLayerDragStart: (info: InteractionInfo) => {
      if (!info || !props.isOnObjectEditor) return
  
      dispatch(actions.viewLayer.dragStarted({
        layerId: info.layerId,
        parentId: info.parentId,
        row: info.row,
        rowsetId: info.rowsetId,
      }))
    },
  
    onLayerDragEnd: (info: InteractionInfo) => {
      if (!info || !props.isOnObjectEditor) return
  
      dispatch(actions.viewLayer.dragEnded({
        layerId: info.layerId,
        parentId: info.parentId,
        pixel: info.pixel,
        row: info.row,
        rowCoordinates: info.rowCoordinates,
        rowsetId: info.rowsetId,
      }))
    },
  
    onResourceDownloadProgressChange: (key: string, entity: ResourceType, progress?: number) => {
      dispatch(actions.resource.downloadProgress({key, entity, progress}))
    },
  
    onViewLoad: (viewport: OrbitViewport | OrthographicViewport | WebMercatorViewport, dimensions: Dimensions) => {
      if (!props.visualization || !props.world || !props.viewState) return
  
      const visualizationDimensions = getFixedDimensions(dimensions, props.visualization)
      const center = getCenterOfTheWorldCoordinates(props.world, visualizationDimensions, props.axesDimensions)
      const updatedViewState = props.viewState
        .setViewport(viewport)
        .setCenter(center)
        .setDimensions(visualizationDimensions)
        .fitToContentBox()
  
      dispatch(rootActions.view.viewLoaded({
        visualizationId: props.visualization.id,
        viewState: updatedViewState,
      }))
    },
  
    onViewResize: (viewport: OrbitViewport | OrthographicViewport | WebMercatorViewport, dimensions: Dimensions) => {
      if (
        !props.visualization ||
        !props.viewState ||
        !props.world ||
        !props.world?.projection ||
        isEqual(props.viewState?.getDimensions(), dimensions)
      ) return
      
      const center = getCenterOfTheWorldCoordinates(props.world, dimensions, props.axesDimensions)
      const updatedViewState = props.viewState
        .setViewport(viewport)
        .setCenter(center)
        .setDimensions(dimensions)
        .fitToContentBox()
  
      return dispatch(rootActions.view.viewResized({
        viewState: updatedViewState,
      }))
    },
  
    onViewZooming: (event, viewState?: ViewState) => {
      if (!props.visualization || !props.world || !viewState) return
  
      const updatedViewState = viewState.withDeckViewState(event.viewState)
  
      dispatch(rootActions.view.viewZooming({
        direction: event.viewState?.zoom > event.oldViewState?.zoom ? 'IN' : 'OUT',
        viewState: updatedViewState,
      }))
    },
  
    onViewHover: (info) => {
      if (info.layer) return
      return dispatch(rootActions.viewLayer.mouseLeft({navigation}))
    },
  
    onViewClick: (info) => {
      if (info.layer) return
      return dispatch(rootActions.viewLayer.clickOut())
    },
  
    onViewDragStart: () => {
      return dispatch(rootActions.view.viewDragStart({}))
    },
  
    onViewDragEnd: (info, deckViewState) => {
      if (!info || !props.visualization || !props.viewState) return
  
      const updatedViewState = props.viewState.withDeckViewState(deckViewState)
      const oldProjectedCoordinates = updatedViewState.projectCoordinate(props.viewState.getCoordinates())
      const nextProjectedCoordinates = updatedViewState.projectCoordinate(updatedViewState.getCoordinates())
  
      const displacementDelta = {
        x: oldProjectedCoordinates[0] - nextProjectedCoordinates[0],
        y: oldProjectedCoordinates[1] - nextProjectedCoordinates[1],
      }
  
      return dispatch(rootActions.view.viewDragEnd({
        viewState: updatedViewState,
        displacementDelta,
      }))
    },
  
    onChartCreated: (dimensions: AxesDimensions, projector: Projector) => {
      return dispatch(rootActions.view.chartCreated({dimensions, projector}))
    },
  
    onChartUpdated: (dimensions: AxesDimensions, projector: Projector) => {
      return dispatch(rootActions.view.chartUpdated({dimensions, projector}))
    },
    
    onCropEditEnd: (info: any) => {
      return dispatch(rootActions.viewLayer.cropEditEnd(info))
    },
  }
}

