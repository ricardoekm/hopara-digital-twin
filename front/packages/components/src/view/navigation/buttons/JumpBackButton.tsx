import React from 'react'
import { PureComponent } from '@hopara/design-system'
import { CanvasNavigationButton } from '@hopara/design-system/src/navigation/CanvasNavigationButton'
import { CanvasNavigationButtonGroup } from '@hopara/design-system/src/navigation/CanvasNavigationButtonGroup'
import { i18n } from '@hopara/i18n'

export class JumpBackButton extends PureComponent<{ isJumping?: boolean, onClick: () => void }> {
  render() {
    if (!this.props.isJumping) return null
    return (
      <CanvasNavigationButtonGroup>
        <CanvasNavigationButton
          label={i18n('NAVIGATE_TO_PREVIOUS_VISUALIZATION')}
          icon='jump-back'
          onClick={this.props.onClick}
          tooltipPlacement='right'
        />
      </CanvasNavigationButtonGroup>
    )
  }
}
