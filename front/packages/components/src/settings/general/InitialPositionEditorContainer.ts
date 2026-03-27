import {Store} from '../../state/Store'
import actions from '../../state/Actions'
import {connect} from '@hopara/state'
import {Dispatch} from '@reduxjs/toolkit'
import { DEFAULT_PADDING } from '../../zoom/translate/BoundsPadding'
import {PositionType, Position} from '../../view-state/ViewState'
import {InitialPositionEditor, StateProps, ActionProps} from './InitialPositionEditor'
import {useMemo} from 'react'
import {i18n} from '@hopara/i18n'

function mapState(state: Store): StateProps {
  const layers = state.layerStore.layers
  
  // Transform layers to select options with "None" option
  const layerOptions = useMemo(() => {
    const options = layers.map((layer) => ({
      value: layer.getId(),
      label: layer.name,
    }))
    
    // Add "None" option at the beginning to allow disabling the feature
    options.unshift({ value: '', label: i18n('NONE_FEMALE') })
    
    return options
  }, [layers])

  return {
    canEditInitialPosition: !state.visualizationStore.visualization.isChart(),
    viewState: state.viewState!,
    initialPosition: state.viewState?.initialPosition,
    visualizationType: state.visualizationStore.visualization.type,
    layerOptions,
  }
}

function mapActions(dispatch: Dispatch, props: StateProps): ActionProps {
  return {
    onSetInitialPosition: () => {
      dispatch(actions.viewState.initialPositionChanged({
        type: PositionType.FIXED,
        x: props.viewState.getCoordinates().x,
        y: props.viewState.getCoordinates().y,
        z: props.viewState.getCoordinates().z,
        zoom: props.viewState.zoom,
        bearing: props.viewState.bearing,
        rotationX: props.viewState.rotationX,
        rotationOrbit: props.viewState.rotationOrbit,
      }))
    },
    onTypeChange: (type: PositionType) => {
      if (type === PositionType.FIXED) {
        // When changing to FIXED, set current view as initial
        dispatch(actions.viewState.initialPositionChangedSilently({
          type: PositionType.FIXED,
          x: props.viewState.getCoordinates().x,
          y: props.viewState.getCoordinates().y,
          z: props.viewState.getCoordinates().z,
          zoom: props.viewState.zoom,
          bearing: props.viewState.bearing,
          rotationX: props.viewState.rotationX,
          rotationOrbit: props.viewState.rotationOrbit,
        }))
      } else {
        // When changing to FIT_TO_CONTENT, set type and default padding
        dispatch(actions.viewState.initialPositionChangedSilently({
          type: PositionType.FIT_TO_CONTENT,
          padding: DEFAULT_PADDING,
        }))
      }
    },
    onPaddingChange: (padding: number) => {
      dispatch(actions.viewState.initialPositionChangedSilently({
        type: PositionType.FIT_TO_CONTENT,
        padding,
      }))
    },
    onPositionChange: (position: Partial<Position>) => {
      dispatch(actions.viewState.initialPositionChangedSilently({
        ...props.initialPosition,
        type: PositionType.FIXED,
        ...position,
      }))
    },
    onLayerChange: (layerId: string) => {
      dispatch(actions.viewState.initialPositionChangedSilently({
        ...props.initialPosition,
        type: PositionType.FIT_TO_CONTENT,
        layerId: layerId || undefined,
      }))
    },
  }
}


export const InitialPositionEditorContainer = connect<StateProps, ActionProps>(mapState, mapActions)(InitialPositionEditor)

