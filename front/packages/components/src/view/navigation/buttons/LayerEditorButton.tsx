import React from 'react'
import {CanvasNavigationButton} from '@hopara/design-system/src/navigation/CanvasNavigationButton'
import {CanvasNavigationButtonGroup} from '@hopara/design-system/src/navigation/CanvasNavigationButtonGroup'
import {i18n} from '@hopara/i18n'
import {PureComponent} from '@hopara/design-system'
import {Box} from '@mui/material'

export class LayerEditorButton extends PureComponent<{
  active: boolean,
  href: string,
  onClick: (event: any) => void
}> {
  render() {
    return (
      <CanvasNavigationButtonGroup>
      <CanvasNavigationButton
        label={<Box sx={{'textAlign': 'center'}}>
          {i18n('LAYERS')}
        </Box>}
        icon='layers'
        href={this.props.href}
        onClick={this.props.onClick}
          tooltipPlacement='right'
          active={this.props.active}
        />
      </CanvasNavigationButtonGroup>
    )
  }
}
