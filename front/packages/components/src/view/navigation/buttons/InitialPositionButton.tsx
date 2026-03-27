import React from 'react'
import { PureComponent } from '@hopara/design-system'
import { CanvasNavigationButton } from '@hopara/design-system/src/navigation/CanvasNavigationButton'
import { CanvasNavigationButtonGroup } from '@hopara/design-system/src/navigation/CanvasNavigationButtonGroup'
import { i18n } from '@hopara/i18n'

export class InitialPositionButton extends PureComponent<{ onInitialPositionClick: () => void }> {
  render() {
    return (
      <CanvasNavigationButtonGroup>
        <CanvasNavigationButton
          icon= "initial-position"
          label={i18n('INITIAL_POSITION')}
          onClick={this.props.onInitialPositionClick}
          tooltipPlacement='left' />
      </CanvasNavigationButtonGroup>
    )
  }
}
