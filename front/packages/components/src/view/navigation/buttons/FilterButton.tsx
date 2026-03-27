import React from 'react'
import { PureComponent } from '@hopara/design-system'
import { CanvasNavigationButton } from '@hopara/design-system/src/navigation/CanvasNavigationButton'
import { CanvasNavigationButtonGroup } from '@hopara/design-system/src/navigation/CanvasNavigationButtonGroup'
import { i18n } from '@hopara/i18n'

export class FilterButton extends PureComponent<{ active: boolean, onClick: () => void, hasSelectedFilters: boolean }> {
  render() {
    return (
      <CanvasNavigationButtonGroup>
        <CanvasNavigationButton
          badge={this.props.hasSelectedFilters}
          label={i18n('FILTERS')}
          icon='filters'
          onClick={this.props.onClick}
          tooltipPlacement='right'
          active={this.props.active}
        />
      </CanvasNavigationButtonGroup>
    )
  }
}
