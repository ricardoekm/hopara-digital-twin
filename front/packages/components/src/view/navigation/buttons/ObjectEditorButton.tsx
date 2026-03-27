import React from 'react'
import {CanvasNavigationButton} from '@hopara/design-system/src/navigation/CanvasNavigationButton'
import {CanvasNavigationButtonGroup} from '@hopara/design-system/src/navigation/CanvasNavigationButtonGroup'
import {i18n} from '@hopara/i18n'
import {PureComponent} from '@hopara/design-system'
import {Box} from '@mui/material'

export class ObjectEditorButton extends PureComponent<{ tenant: string, active: boolean, onClick: () => void }> {
  render() {
    return (
      <CanvasNavigationButtonGroup>
      <CanvasNavigationButton
        label={<Box sx={{'textAlign': 'center'}}>
          {i18n('OBJECTS')}
        </Box>}
        icon='scene-builder'
        onClick={this.props.onClick}
        tooltipPlacement='right'
        active={this.props.active}
        />
      </CanvasNavigationButtonGroup>
    )
  }
}
