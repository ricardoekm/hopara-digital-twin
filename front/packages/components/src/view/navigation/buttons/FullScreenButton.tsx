import React from 'react'
import {PureComponent} from '@hopara/design-system'
import {CanvasNavigationButton} from '@hopara/design-system/src/navigation/CanvasNavigationButton'
import {i18n} from '@hopara/i18n'
import {CanvasNavigationButtonGroup} from '@hopara/design-system/src/navigation/CanvasNavigationButtonGroup'

interface Props {
  onFullScreenClick: () => void
  fullScreen: boolean
}

export class FullScreenButton extends PureComponent<Props> {
  render() {
    if (!document.fullscreenEnabled || this.props.fullScreen) return null
    return <CanvasNavigationButtonGroup>
      <CanvasNavigationButton
        icon='full-screen'
        label={i18n('FULL_SCREEN')}
        onClick={this.props.onFullScreenClick}
        tooltipPlacement='left'
      />
    </CanvasNavigationButtonGroup>
  }
}
