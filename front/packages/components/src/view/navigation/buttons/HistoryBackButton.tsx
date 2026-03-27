import React from 'react'
import { PureComponent } from '@hopara/design-system'
import { CanvasNavigationButton } from '@hopara/design-system/src/navigation/CanvasNavigationButton'
import { CanvasNavigationButtonGroup } from '@hopara/design-system/src/navigation/CanvasNavigationButtonGroup'
import { i18n } from '@hopara/i18n'

export class HistoryBackButton extends PureComponent<{ onClick: (e:any) => void }> {
  render() {
    return (
      <CanvasNavigationButtonGroup>
        <CanvasNavigationButton
          label={i18n('BACK')}
          icon='jump-back'
          onClick={this.props.onClick}
          tooltipPlacement='right'
        />
      </CanvasNavigationButtonGroup>
    )
  }
}
