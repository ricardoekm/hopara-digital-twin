import React from 'react'
import {CanvasNavigationButton} from '@hopara/design-system/src/navigation/CanvasNavigationButton'
import {i18n} from '@hopara/i18n'
import { PureComponent } from '@hopara/design-system'
import { CanvasNavigationButtonGroup } from '@hopara/design-system/src/navigation/CanvasNavigationButtonGroup'

export class AutoRotateButton extends PureComponent<{ active: boolean, onClick: () => void }> {
  render() {
    return (
      <CanvasNavigationButtonGroup>
        <CanvasNavigationButton
          label={i18n(this.props.active ? 'STOP_AUTO_ROTATE' : 'START_AUTO_ROTATE')}
          icon={this.props.active ? 'stop-auto-rotate' : 'start-auto-rotate'}
          onClick={this.props.onClick}
          tooltipPlacement='right'
          active={this.props.active}
        />
      </CanvasNavigationButtonGroup>
    )
  }
}
