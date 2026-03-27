import React from 'react'
import { InitialPositionButton } from './buttons/InitialPositionButton'
import { ZoomButton } from './buttons/ZoomButton'
import { ActionProps, StateProps } from './NavigationComponent'
import { FullScreenButton } from './buttons/FullScreenButton'
import { PureComponent } from '@hopara/design-system'
import { ActionButtonsContainer } from './buttons/ActionButtonsContainer'

export class ChartNavigationComponent extends PureComponent<StateProps & ActionProps> {
  render() {
    return (
      <>
        <FullScreenButton
          onFullScreenClick={this.props.onFullScreenClick}
          fullScreen={this.props.fullScreen}
        />
        {this.props.showZoomButtons &&
          <ZoomButton
            onZoomInClick={this.props.onZoomInClick}
            onZoomOutClick={this.props.onZoomOutClick}
          />
        }
        <InitialPositionButton onInitialPositionClick={this.props.onInitialPositionClick}/>
        <ActionButtonsContainer/>
      </>
    )
  }
}
