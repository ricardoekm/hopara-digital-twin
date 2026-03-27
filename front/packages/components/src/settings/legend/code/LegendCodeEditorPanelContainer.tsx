import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import actions from '../../../state/Actions'
import {Store} from '../../../state/Store'
import {ActionProps, CodeEditorPanel, StateProps} from './LegendCodeEditorPanel'
import {SettingsMenuItemId} from '../../SettingsMenu'
import { useMemo } from 'react'

function mapState(state: Store): StateProps {
  const obj = state.legends
  const schema = state.schema?.definitions ? {...state.schema.definitions['Legends']} : {}
  schema['definitions'] = state.schema.definitions
  const discarded = state.visualizationStore.editStatus === 'DISCARDED'
  const lagendVersion = useMemo(() => discarded ? Date.now().toString() : '', [discarded])
  return {obj, schema, visible: state.visualizationStore.advancedModeArea.includes(SettingsMenuItemId.COLOR_LEGENDS), lagendVersion}
}

function mapActions(dispatch: Dispatch): ActionProps {
  return {
    onChange: (legends: any): void => {
      dispatch(actions.legend.changed({legends}))
    },
    onBackClick: (): void => {
      dispatch(actions.visualization.advancedModeClicked({area: SettingsMenuItemId.COLOR_LEGENDS, enabled: false}))
    },
  }
}

export default connect<StateProps, ActionProps>(mapState, mapActions)(CodeEditorPanel)
