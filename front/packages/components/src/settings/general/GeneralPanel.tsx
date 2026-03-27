import React, {Suspense} from 'react'
import {PureComponent} from '@hopara/design-system'
import {GeneralDefaultPanelContainer} from './GeneralDefaultPanel'
import {Store} from '../../state/Store'
import {SettingsMenuItemId} from '../SettingsMenu'
import {connect} from '@hopara/state'
import {GeneralAdvancedPanelContainer} from './GeneralAdvancedPanel'

export interface StateProps {
  isAdvancedMode: boolean
}

type Props = StateProps

export class GeneralPanel extends PureComponent<Props> {
  render() {
    if (!this.props.isAdvancedMode) return <GeneralDefaultPanelContainer/>

    return <Suspense fallback={null}>
      <GeneralAdvancedPanelContainer/>
    </Suspense>
  }
}

function mapState(state: Store): StateProps {
  return {
    isAdvancedMode: state.visualizationStore.advancedModeArea.includes(SettingsMenuItemId.GENERAL),
  }
}

export const GeneralPanelContainer = connect<StateProps, {}>(mapState, () => ({}))(GeneralPanel)

