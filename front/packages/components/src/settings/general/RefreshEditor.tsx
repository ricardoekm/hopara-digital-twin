import React from 'react'
import { PureComponent } from '@hopara/design-system'
import {i18n} from '@hopara/i18n'
import {PanelField} from '@hopara/design-system/src/panel/PanelField'
import {Box, Switch} from '@mui/material'
import {connect} from '@hopara/state'
import actions from '../../state/Actions'
import {Dispatch} from '@reduxjs/toolkit'
import {Store} from '../../state/Store'
import { PanelCard } from '@hopara/design-system/src/panel/PanelCard'

const DEFAULT_REFRESH_PERIOD = 60

interface StateProps {
  enabled: boolean
}

interface ActionProps {
  onChange: (enabled: boolean) => void;
}

type Props = StateProps & ActionProps

export class RefreshEditor extends PureComponent<Props> {
  render() {
    return (
    <PanelCard>
      <PanelField
        title={i18n('AUTO_REFRESH')}
        layout="toggle"
        helperText={i18n('WHEN_ENABLED_THE_VISUALIZATION_WILL_BE_REFRESHED_EVERY_MINUTE')}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'right',
          }}
        >
          <Switch
            checked={this.props.enabled}
            onChange={(event) => {
              this.props.onChange(event.target.checked)
            }}
          />
        </Box>
      </PanelField>
    </PanelCard>
    )
  }
}

function mapState(state: Store): StateProps {
  return {
    enabled: (state.visualizationStore.visualization.refreshPeriod ?? 0) > 0,
  }
}

function mapActions(dispatch: Dispatch): ActionProps {
  return {
    onChange: (enabled): void => {
      dispatch(actions.visualization.refreshPeriodChanged({refreshPeriod: enabled ? DEFAULT_REFRESH_PERIOD : undefined}))
    },
  }
}

export const RefreshEditorContainer = connect<StateProps, ActionProps>(mapState, mapActions)(RefreshEditor)

