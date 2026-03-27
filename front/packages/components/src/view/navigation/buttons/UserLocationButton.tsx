import React from 'react'
import {PureComponent} from '@hopara/design-system'
import {CanvasNavigationButton} from '@hopara/design-system/src/navigation/CanvasNavigationButton'
import {CanvasNavigationButtonGroup} from '@hopara/design-system/src/navigation/CanvasNavigationButtonGroup'
import {i18n} from '@hopara/i18n'

export interface StateProps {
  showingUserLocation?: boolean
  loadingUserLocation?: boolean 
}

export interface ActionProps {
  onClick: () => void
}


export class UserLocationButton extends PureComponent<StateProps & ActionProps> {
  render() {
    return (
      <CanvasNavigationButtonGroup>
        <CanvasNavigationButton
          label={this.props.showingUserLocation ? i18n('HIDE_USER_LOCATION') : i18n('SHOW_USER_LOCATION')}
          icon={
            this.props.loadingUserLocation
              ? 'progress-activity'
              : this.props.showingUserLocation
                ? 'user-location-active'
                : 'user-location'
          }
          onClick={this.props.onClick}
          tooltipPlacement='left'
        />
      </CanvasNavigationButtonGroup>
    )
  }
}
