import React from 'react'
import {GeoObjectEditorNavigationComponent} from './GeoObjectEditorNavigationComponent'
import {GeoNavigationComponent} from './GeoNavigationComponent'
import {WhiteBoardNavigationComponent} from './WhiteBoardNavigationComponent'
import {OrbitNavigationComponent} from './OrbitNavigationComponent'
import Visualization from '../../visualization/Visualization'
import {Authorization} from '@hopara/authorization'
import {PureComponent} from '@hopara/design-system'
import {MapStyle} from '@hopara/encoding'
import {CanvasNavigationBar} from '@hopara/design-system/src/navigation/CanvasNavigationBar'
import {ChartNavigationComponent} from './ChartNavigationComponent'
import {ViewCube} from './ViewCube'

export interface StateProps {
  isRotateMode: boolean
  visualization?: Visualization
  currentStyle?: MapStyle
  isOnObjectEditor: boolean
  authorization: Authorization
  fullScreen: boolean
  visualizationsListLink: string
  isEditingDirtyVisualization: boolean
  visible?: boolean
  isAutoRotateEnabled: boolean
  isAutoNavigationEnabled: boolean
  showZoomButtons: boolean
  showAutoNavigateButton: boolean
  rotation: { x: number, y: number }
}

export interface ActionProps {
  onMapStyleClick: (mapStyle: MapStyle) => void
  onInitialPositionClick: () => void
  onBearingModeClick: () => void
  onZoomInClick: () => void
  onZoomOutClick: () => void
  onFullScreenClick: () => void
  onAutoRotateClick: () => void
  onAutoNavigateClick: () => void
  onRotationChange: (rotX: number, rotY: number) => void
}

export class NavigationComponent extends PureComponent<StateProps & ActionProps> {
  render() {
    if (!this.props.visualization) return null
    return (<>
        {this.props.visualization.is3D() && this.props.isOnObjectEditor && <ViewCube {...this.props} />}
        <CanvasNavigationBar id='visualization-nav-bar'
                             className={this.props.visible ? 'canvasNavigationBarisVisible' : 'canvasNavigationBarisHidden'}
                             sx={{
                               'gridRowEnd': -1,
                               '--gridArea': 'right',
                             }}>
          {this.props.visualization?.isGeo() && this.props.isOnObjectEditor &&
            <GeoObjectEditorNavigationComponent {...this.props} />}
          {this.props.visualization?.isGeo() && !this.props.isOnObjectEditor &&
            <GeoNavigationComponent {...this.props} />}
          {this.props.visualization?.isChart() &&
            <ChartNavigationComponent {...this.props} />}
          {this.props.visualization?.isWhiteboard() &&
            <WhiteBoardNavigationComponent {...this.props} />}
          {this.props.visualization?.is3D() &&
            <OrbitNavigationComponent {...this.props} />}
        </CanvasNavigationBar>
      </>
    )
  }
}
