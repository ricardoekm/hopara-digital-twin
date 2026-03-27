import React from 'react'
import {Layer} from '../Layer'
import Visualization from '../../visualization/Visualization'
import {LayerEditorList} from './LayerEditorList'
import {Layers} from '../Layers'
import {LayerType} from '../LayerType'
import {isEmpty} from 'lodash/fp'
import {TransitionType} from '@hopara/design-system/src/transitions/SlideTransition'
import {PureComponent} from '@hopara/design-system'
import {VisualizationEditStatus} from '../../visualization/VisualizationEditStatus'
import {PanelTitleBar} from '@hopara/design-system/src/panel/PanelTitleBar'
import {i18n} from '@hopara/i18n'
import {SaveDiscardEditorContainer} from '../../visualization/SaveDiscardEditorContainer'
import {CloseEditorButtonContainer} from '../../visualization/CloseEditorContainer'
import {Panel} from '@hopara/design-system/src/panel/Panel'
import {PanelButton} from '@hopara/design-system/src/buttons/PanelButton'
import {Icon} from '@hopara/design-system/src/icons/Icon'

export type StateProps = {
  layers: Layers
  selectedLayerId?: string
  schema: any
  visualization: Visualization
  transition?: TransitionType
  visualizationStatus?: VisualizationEditStatus
  parentLayer?: Layer
}

export type ActionProps = {
  onNewClick: (layer?: Partial<Layer>, type?: LayerType, parentId?: string) => void
  onDeleteClick: (id: string) => void
  onDuplicateClick: (id: string) => void
  onClick: (id: string) => void
  onMove: (layerId: string, steps: number) => void
  onEditInAdvancedModeClick: (layer: Layer) => void
  onEjectClick: (id: string) => void
  onHistoryClick: () => void
}

export type Props = StateProps & ActionProps

const actionTransitionType = {
  rootToPrimary: TransitionType.LEFT,
  primaryToRoot: TransitionType.RIGHT,
  primaryToSecondary: TransitionType.LEFT,
  secondaryToPrimary: TransitionType.RIGHT,
}

export class LayerListPanel extends PureComponent<Props> {
  setSlideDirection(direction: TransitionType, callback: any) {
    this.setState({transition: direction}, () => callback && callback())
  }

  handleNewLayerClick() {
    return this.setSlideDirection(actionTransitionType.rootToPrimary, this.props.onNewClick)
  }

  handleLayerClick(layerId: string) {
    return this.setSlideDirection(actionTransitionType.rootToPrimary, () => {
      return this.props.onClick(layerId)
    })
  }

  handleLayerDuplicateClick(layerId: string) {
    return this.setSlideDirection(actionTransitionType.rootToPrimary, () => {
      return this.props.onDuplicateClick(layerId)
    })
  }

  render(): React.ReactNode {
    const isSavingOrDiscarding = this.props.visualizationStatus === VisualizationEditStatus.SAVING || this.props.visualizationStatus === VisualizationEditStatus.DISCARDING
    const isDirty = this.props.visualizationStatus === VisualizationEditStatus.DIRTY
    
    return (<Panel
        header={<PanelTitleBar
          title={i18n('LAYERS')}
          helper={this.props.layers.length ? i18n('EMPTY_LAYERS') : undefined}
          buttons={[
            <SaveDiscardEditorContainer key="save-discard"/>,
            <>
              {isDirty || !isSavingOrDiscarding && <PanelButton onClick={this.props.onHistoryClick} key="history-button">
                  <Icon icon="history"/>
                </PanelButton>
              }
            </>,
            <CloseEditorButtonContainer key="close"/>,
          ]}
        />}
      >
        <LayerEditorList
          visualizationIsChart={this.props.visualization?.isChart()}
          list={this.props.layers}
          isItemLoading={isEmpty(this.props.schema) || isEmpty(this.props.visualization)}
          onNewLayerClick={this.handleNewLayerClick.bind(this)}
          onLayerClick={this.handleLayerClick.bind(this)}
          onLayerDeleteClick={(id: string) => this.props.onDeleteClick(id)}
          onLayerDuplicateClick={(layerId: string) => this.handleLayerDuplicateClick(layerId)}
          onLayerMove={(layer: Layer, steps) => this.props.onMove(layer.getId(), steps)}
          onEditInAdvancedModeClick={(layer) => this.props.onEditInAdvancedModeClick(layer)}
          onLayerEjectClick={(id: string) => this.props.onEjectClick(id)}
        />
      </Panel>
    )
  }
}
