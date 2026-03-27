import React from 'react'
import {PureComponent} from '@hopara/design-system'
import {LayerListContainer} from './LayerListContainer'
import {LayerEditorItemContainer} from './LayerEditorItemContainer'
import {Layer} from '../Layer'
import {Store} from '../../state/Store'
import {connect} from '@hopara/state'
import {SlideTransition, TransitionType} from '@hopara/design-system/src/transitions/SlideTransition'
import {VisualizationEditStatus} from '../../visualization/VisualizationEditStatus'
import actions from '../../state/Actions'
import {Dispatch} from '@reduxjs/toolkit'
import {Layers} from '../Layers'
import {VisualizationHistoryContainer} from '../../visualization/history/VisualizationHistoryContainer'
import {HistoryStatus} from '../../visualization/history/store/VisualizationHistoryStore'

interface StateProps {
  layer?: Layer
  layers: Layers
  visualizationStatus?: VisualizationEditStatus
  historyOpen: boolean,
  parentLayer?: Layer
  isGoingBack: boolean
}

interface ActionProps {
  saveVisualizationRequest: () => void
}

type Props = StateProps & ActionProps

class Comp extends PureComponent<Props> {
  prevProps?: Props

  componentDidUpdate(prevProps: Props) {
    this.prevProps = prevProps
  }

  getTransitionType() {
    // Se estamos voltando (seja para o pai ou para a lista)
    if (this.props.isGoingBack) {
      return TransitionType.LEFT
    }

    // Em todos os outros casos estamos ENTRANDO
    return TransitionType.RIGHT
  }

  getComponent() {
    if (this.props.layer) {
      return <LayerEditorItemContainer/>
    }
    if (this.props.historyOpen) {
      return <VisualizationHistoryContainer/>
    }
    return <LayerListContainer/>
  }

  render() {
    const transitionKey = this.props.layer ? 
      (this.props.parentLayer ? `child-${this.props.layer.getId()}` : `parent-${this.props.layer.getId()}`) : 
      'root'

    return (
      <SlideTransition 
        transition={this.getTransitionType()}
        transitionKey={transitionKey}
      >
        {this.getComponent()}
      </SlideTransition>
    )
  }
}

function mapState(state: Store): StateProps {
  const layer = state.layerStore.getSelectedLayer()
  return {
    layer,
    layers: state.layerStore.layers,
    visualizationStatus: state.visualizationStore.editStatus,
    historyOpen: state.history.status !== HistoryStatus.CLOSED,
    parentLayer: layer ? state.layerStore.layers.getById(layer.parentId) : undefined,
    isGoingBack: state.layerStore.isGoingBack,
  }
}

function mapActions(dispatch: Dispatch): ActionProps {
  return {
    saveVisualizationRequest: () => {
      dispatch(actions.visualization.save.request())
    },
  }
}

export const LayerContainer = connect<StateProps, ActionProps>(mapState, mapActions)(Comp)
