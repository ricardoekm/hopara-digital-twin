import {Store} from '../../state/Store'
import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import actions from '../../state/Actions'
import {useMemo} from 'react'
import {StateProps, ActionProps, GridEditorComponent} from './GridEditorComponent'
import { SizeEncoding } from '@hopara/encoding'

function mapState(state: Store): StateProps {
  const layerGrids = useMemo(() => {
    return state.layerStore.layers.map((layer) => ({
      name: layer.name,
      id: layer.getId(),
      grid: state.grid.getByLayerId(layer.getId())
    }))
  }, [state.layerStore.layers, state.grid])

  const schema = state.schema?.definitions ? {...state.schema.definitions['Grids']} : {}
  schema['definitions'] = state.schema.definitions

  return {
    layerGrids,
    zoom: state.viewState?.zoom ?? 0,
    schema,
    grids: state.grid
  }
}

function mapActions(dispatch: Dispatch): ActionProps {
  return {
    onEnable: (layerId: string): void => {
      dispatch(actions.grid.enable({layerId}))
    },
    onSizeChanged: (layerId: string, encoding: SizeEncoding): void => {
      dispatch(actions.grid.sizeChanged({layerId, encoding}))
    },
    onStrokeSizeChanged: (layerId: string, encoding: SizeEncoding): void => {
      dispatch(actions.grid.strokeSizeChanged({layerId, encoding}))
    },
    onCodeChange: (code: any): void => {
      dispatch(actions.grid.codeChanged({code}))
    }
  }
}

export const GridEditorContainer = connect<StateProps, ActionProps>(mapState, mapActions)(GridEditorComponent)

