import React from 'react'
import {Store} from '../state/Store'
import {LegendComponent, StateProps} from './LegendComponent'
import { connect } from '@hopara/state'

function mapState(state: Store): StateProps {
  const layers = React.useMemo(() => state.layerStore.layers.getVisibles(state.viewState?.zoom), [state.viewState?.zoom])
  return {
    visualization: state.visualizationStore.visualization,
    layers,
    queries: state.queryStore.queries,
    legends: state.legends,
    rowsets: state.rowsetStore.getRowsets(),
  }
}

function shouldRender(state: Store) {
  return !!state.visualizationStore.visualization
}

export const LegendContainer = connect(mapState, undefined, shouldRender)(LegendComponent)
