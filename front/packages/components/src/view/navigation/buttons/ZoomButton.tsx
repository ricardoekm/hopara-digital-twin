import React from 'react'
import { PureComponent } from '@hopara/design-system'
import { CanvasNavigationButton } from '@hopara/design-system/src/navigation/CanvasNavigationButton'
import { CanvasNavigationButtonGroup } from '@hopara/design-system/src/navigation/CanvasNavigationButtonGroup'
import { i18n } from '@hopara/i18n'

export class ZoomButton extends PureComponent<{ onZoomInClick: () => void, onZoomOutClick: () => void }> {
  render() {
    return (
      <CanvasNavigationButtonGroup className="hideOnSmallViewport">
        <CanvasNavigationButton
          label={i18n('ZOOM_IN')}
          icon="zoom-in"
          onClick={this.props.onZoomInClick}
          tooltipPlacement='left'
          testId='zoom-in-button' />
        <CanvasNavigationButton
          label={i18n('ZOOM_OUT')}
          icon="zoom-out"
          onClick={this.props.onZoomOutClick}
          tooltipPlacement='left'
          testId='zoom-out-button' />
      </CanvasNavigationButtonGroup>
    )
  }
}
