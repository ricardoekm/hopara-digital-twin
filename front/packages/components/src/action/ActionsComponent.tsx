import React from 'react'
import { PureComponent } from '@hopara/design-system'
import {ActionEditor} from './editor/ActionEditor'
import {i18n} from '@hopara/i18n'
import {ActionsEditor} from './editor/ActionsEditor'
import Visualization from '../visualization/Visualization'
import {Action} from './Action'
import {SelectOption} from '@hopara/design-system/src'
import {Panel} from '@hopara/design-system/src/panel/Panel'
import { PanelTitleBar } from '@hopara/design-system/src/panel/PanelTitleBar'

export interface StateProps {
  selectedAction?: Action
  visualization: Visualization
  visualizations: Visualization[]
  maxZoom: number
  minZoom: number
  zoom: number
  filterOptions: SelectOption[]
  filterStatus: 'loading' | 'idle' | 'error'
}

export interface ActionProps {
  onSubItemClick: (id?: string) => void
  onItemChange: (item: Action) => void
  newActionClick: () => void
  onDelete: (id: string) => void
  onMove: (args: { sourceIndex: number, destinationIndex: number }) => void
  onVisualizationChanged: (visualization: string) => void
}

type Props = StateProps & ActionProps

export class ActionsComponent extends PureComponent<Props> {
  render() {
    return <>
      {this.props.selectedAction && <ActionEditor
        visualizations={this.props.visualizations}
        showIconField={true}
        action={this.props.selectedAction}
        onChange={this.props.onItemChange}
        onBack={() => this.props.onSubItemClick(undefined)}
        maxZoom={this.props.maxZoom}
        minZoom={this.props.minZoom}
        zoom={this.props.zoom}
        onVisualizationChanged={(visualization) => this.props.onVisualizationChanged(visualization)}
        filterOptions={this.props.filterOptions}
        filterStatus={this.props.filterStatus}
        showFilter={false}
      />
      }
      {!this.props.selectedAction && <Panel
        header={<PanelTitleBar
          title={i18n('ACTIONS')}
        />}
      >
        <ActionsEditor
          items={this.props.visualization.actions}
          newActionClick={this.props.newActionClick}
          onDelete={this.props.onDelete}
          onMove={this.props.onMove}
          onItemClick={this.props.onSubItemClick}
          sublist={true}
        />
      </Panel>}
    </>
  }
}
