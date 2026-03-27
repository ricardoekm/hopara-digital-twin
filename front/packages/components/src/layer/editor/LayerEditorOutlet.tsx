import React from 'react'
import {PureComponent} from '@hopara/design-system'
import {Beforeunload} from 'react-beforeunload'
import {VisualizationEditStatus} from '../../visualization/VisualizationEditStatus'
import {Layers} from '../Layers'
import {DetailsState} from '../../details/state/DetailsReducer'
import {LayerContainer} from './LayerContainer'
import {LayerEditorShortcuts} from './LayerEditorShortcuts'
import {PanelWrapper} from '@hopara/design-system/src/VisualizationLayout'
import {Authorization} from '@hopara/authorization'
import {Area} from '../../visualization/pages/Area'

export interface StateProps {
  details?: DetailsState
  visualizationName?: string
  visualizationId?: string
  fallbackVisualizationId?: string
  layers: Layers
  visualizationStatus?: VisualizationEditStatus
  authorization: Authorization
  exitDestination?: Area
}

export interface ActionProps {
  onLoad: () => void
}

export class LayerEditorOutlet extends PureComponent<StateProps & ActionProps> {
  componentDidMount(): void {
    this.props.onLoad()
  }

  handleBeforeUnload(event: BeforeUnloadEvent): void {
    if (!this.props.exitDestination && this.props.visualizationStatus === VisualizationEditStatus.DIRTY) {
      event.preventDefault()
    }
  }

  render() {
    return (
      <>
        <LayerEditorShortcuts/>
        <Beforeunload onBeforeunload={this.handleBeforeUnload.bind(this)}/>
        <PanelWrapper opaqueBackground>
          <LayerContainer/>
        </PanelWrapper>
      </>
    )
  }
}
