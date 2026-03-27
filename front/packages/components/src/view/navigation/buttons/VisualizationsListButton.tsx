import React from 'react'
import { PureComponent } from '@hopara/design-system'
import { CanvasNavigationButton } from '@hopara/design-system/src/navigation/CanvasNavigationButton'
import { CanvasNavigationButtonGroup } from '@hopara/design-system/src/navigation/CanvasNavigationButtonGroup'
import { i18n } from '@hopara/i18n'

export class VisualizationsListButton extends PureComponent<{ link: string, onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void}> {
  render() {
    return (
      <CanvasNavigationButtonGroup className="rounded">
        <CanvasNavigationButton
          label={i18n('BACK_TO_VISUALIZATIONS')}
          icon="jump-back"
          onClick={this.props.onClick}
          tooltipPlacement='right'
          href={this.props.link}
          size='small'
          >
        </CanvasNavigationButton>
      </CanvasNavigationButtonGroup>
    )
  }
}
