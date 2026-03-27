import React from 'react'
import { InitialPositionButton } from './buttons/InitialPositionButton'
import { ZoomButton } from './buttons/ZoomButton'
import { DragModeButton } from './buttons/DragModeButton'
import { ActionProps, StateProps } from './NavigationComponent'
import { FullScreenButton } from './buttons/FullScreenButton'
import { PureComponent } from '@hopara/design-system'
import { AutoRotateButton } from './buttons/AutoRotateButton'
import { ActionButtonsContainer } from './buttons/ActionButtonsContainer'
import { SearchButtonContainer } from './buttons/SearchButtonContainer'

export class OrbitNavigationComponent extends PureComponent<StateProps & ActionProps> {
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
        <DragModeButton isRotateMode={this.props.isRotateMode} onClick={this.props.onBearingModeClick} />
        <AutoRotateButton active={this.props.isAutoRotateEnabled} onClick={this.props.onAutoRotateClick} />
        <ActionButtonsContainer/>
      </>
    )
  }
}
