import React, {lazy, Suspense} from 'react'
import {PureComponent} from '@hopara/design-system'
import {View} from './View'
import Visualization from '../visualization/Visualization'
import {VisualizationLoadStatus} from '../visualization/VisualizationLoadStatus'
import {AttributionFooter} from '@hopara/design-system/src/branding/AttributionFooter'
import {getMapStyleSource} from '../map/MapStyleFactory'
import {MapStyle} from '@hopara/encoding'
import {Authorization} from '@hopara/authorization'

import {Area} from '../visualization/pages/Area'
import { EmptyStateType } from './empty-states/CanvasEmptyState'

const GeoViewContainer = lazy(() => import(/* webpackPrefetch: true */ './geo/GeoViewContainer') as any)
const ChartViewContainer = lazy(() => import(/* webpackPrefetch: true */ './chart/ChartViewContainer') as any)
const ThreeDViewContainer = lazy(() => import(/* webpackPrefetch: true */ './3d/3DViewContainer') as any)
const WhiteboardViewContainer = lazy(() => import(/* webpackPrefetch: true */ './whiteboard/WhiteboardViewContainer') as any)

export interface StateProps {
  fetchProgress?: number
  visualization?: Visualization
  mapStyle?: MapStyle
  appStatus: VisualizationLoadStatus
  area: Area
  blockingError?: string
  isDirty: boolean
  visualizationId?: string
  isLoading: boolean
  hasAxis: boolean
  hasFilters: boolean
  hasEditPermissions: boolean
  authorization: Authorization
  someRowsetLoading: boolean
  emptyStateType?: EmptyStateType
}

export class ViewComponent extends PureComponent<StateProps> {
  render() {
    return (
      <View
        someRowsetLoading={this.props.someRowsetLoading}
        isLoading={this.props.isLoading}
        fetchProgress={this.props.fetchProgress}
        isDirty={this.props.isDirty}
        blockingError={this.props.blockingError}
        isEditing={this.props.area === Area.LAYER_EDITOR || this.props.area === Area.SETTINGS}
        visualizationId={this.props.visualization?.id}
        hasAxis={this.props.hasAxis}
        isChartWithFiltersOrEditPermissions={!!this.props.visualization?.isChart() && (this.props.hasFilters || this.props.hasEditPermissions)}
        emptyStateType={this.props.emptyStateType}
        isGeo={this.props.visualization?.isGeo()}
        backgroundColor={this.props.visualization?.backgroundColor}
        view={
          <Suspense fallback={null}>
            {this.props.visualization?.isGeo() && <GeoViewContainer/>}
            {this.props.visualization?.isChart() && <ChartViewContainer/>}
            {this.props.visualization?.isWhiteboard() && <WhiteboardViewContainer/>}
            {this.props.visualization?.is3D() && <ThreeDViewContainer/>}
          </Suspense>
        }
        attribution={this.props.visualization?.showAttribution() && this.props.authorization.tenant !== 'perkinelmer.com' &&
          <AttributionFooter
            showMapAttribution={!!this.props.mapStyle && this.props.mapStyle !== MapStyle.none}
            mapSource={getMapStyleSource(this.props.mapStyle)}
          />}
      />
    )
  }
}
