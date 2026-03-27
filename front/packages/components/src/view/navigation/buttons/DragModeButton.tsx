import React from 'react'
import { PureComponent } from '@hopara/design-system'
import { CanvasNavigationButton } from '@hopara/design-system/src/navigation/CanvasNavigationButton'
import { CanvasNavigationButtonGroup } from '@hopara/design-system/src/navigation/CanvasNavigationButtonGroup'
import { i18n } from '@hopara/i18n'
import { Typography } from '@mui/material'

export class DragModeButton extends PureComponent<{ isRotateMode: boolean, onClick: () => void }> {
  render() {
    return (
      <CanvasNavigationButtonGroup>
        <CanvasNavigationButton
          label={
            <>
              <Typography variant='body1' sx={{
                color: 'inherit',
                fontWeight: 'inherit',
                fontSize: 'inherit',
                marginBottom: 0,
              }}>
                {this.props.isRotateMode ? i18n('SELECT_TO_PAN_THE_VIEW') : i18n('SELECT_TO_ROTATE_THE_VIEW')}
              </Typography>
              <Typography variant='caption'>{i18n('OR_HOLD_ALT')}</Typography>
            </>
          }
          icon={this.props.isRotateMode ? 'pan' : 'orbit'}
          onClick={this.props.onClick}
          tooltipPlacement='left'
          testId='drag-mode-button'/>
      </CanvasNavigationButtonGroup>
    )
  }
}
