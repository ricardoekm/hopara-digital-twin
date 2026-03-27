import React from 'react'
import { InitialPositionButton } from './buttons/InitialPositionButton'
import { ZoomButton } from './buttons/ZoomButton'
import { DragModeButton } from './buttons/DragModeButton'
import { ActionProps, StateProps } from './NavigationComponent'
import { FullScreenButton } from './buttons/FullScreenButton'
import { PureComponent } from '@hopara/design-system'
import { ElevatorContainer } from './buttons/ElevatorContainer'
import { MapButtonContainer } from './buttons/MapButtonContainer'
import { ActionButtonsContainer } from './buttons/ActionButtonsContainer'
import { SearchButtonContainer } from './buttons/SearchButtonContainer'
import { UserLocationButtonContainer } from './buttons/UserLocationButtonContainer'

export class GeoObjectEditorNavigationComponent extends PureComponent<StateProps & ActionProps> {
  render() {
    return (
      <>
        <FullScreenButton
          onFullScreenClick={this.props.onFullScreenClick}
          fullScreen={this.props.fullScreen}
        />
        <SearchButtonContainer />
        {this.props.showZoomButtons &&
          <ZoomButton
            onZoomInClick={this.props.onZoomInClick}
            onZoomOutClick={this.props.onZoomOutClick}
          />
        }
        <InitialPositionButton onInitialPositionClick={this.props.onInitialPositionClick} />
        <UserLocationButtonContainer />
        <ElevatorContainer />
        <DragModeButton isRotateMode={this.props.isRotateMode}
                     onClick={this.props.onBearingModeClick} />
        <MapButtonContainer/>
        <ActionButtonsContainer/>
      </>
    )
  }
}
