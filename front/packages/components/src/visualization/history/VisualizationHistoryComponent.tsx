import Visualization from '../Visualization'
import {VisualizationHistory} from './domain/VisualizationHistory'
import {Panel} from '@hopara/design-system/src/panel/Panel'
import {PanelTitleBar} from '@hopara/design-system/src/panel/PanelTitleBar'
import {i18n} from '@hopara/i18n'
import {VersionHistory} from '@hopara/design-system/src/history/VersionHistory'
import React from 'react'
import {PureComponent} from '@hopara/design-system'
import {Authorization} from '@hopara/authorization'
import {SaveDiscardEditorContainer} from '../SaveDiscardEditorContainer'

export interface StateProps {
  visualization: Visualization;
  loading: boolean;
  history: VisualizationHistory;
  currentVersion?: number;
  authorization: Authorization;
  fallbackVisualizationId?: string;
}

export interface ActionProps {
  onCheckoutVersion: (version?: number) => void;
  onBackClick: () => void;
}

type Props = StateProps & ActionProps


export class VisualizationHistoryComponent extends PureComponent<Props> {
  render() {
    return (
      <Panel
        header={<PanelTitleBar
          title={i18n('VERSION_HISTORY')}
          onBackClick={this.props.onBackClick}
          buttons={[<SaveDiscardEditorContainer key="save-discard" />]}
        />}
      >
        <VersionHistory
          loading={this.props.loading}
          items={this.props.history}
          currentVersion={this.props.currentVersion}
          onCheckoutVersion={this.props.onCheckoutVersion}
          disableAnonymous
        />
      </Panel>
    )
  }
}
