import {Filters} from '../../../filter/domain/spec/Filter.js'
import {Layers} from '../../../layer/domain/spec/Layer.js'
import {Actions} from '../../../layer/domain/spec/Action.js'
import { FixedZoomRange } from '../../../layer/domain/spec/FixedZoomRange.js'
import { ThreeDLights } from '../../../lights/3DLights.js'
import { Condition } from '../../../encoding/domain/spec/Condition.js'
import { Grids } from '../../../grid/Grid.js'

export enum VisualizationType {
  GEO = 'GEO',
  CHART = 'CHART',
  CUSTOM = 'CUSTOM',
  THREE_D = '3D',
  WHITEBOARD = 'WHITEBOARD',
  ISOMETRIC_WHITEBOARD = 'ISOMETRIC_WHITEBOARD',

}

export enum InitialPositionType {
  FIXED = 'FIXED',
  FIT_TO_CONTENT = 'FIT_TO_CONTENT'
}

export interface InitialPosition {
  type?: InitialPositionType
  layerId?: string
  x?: number
  y?: number
  z?: number
  zoom?: number
  bearing?: number
  pitch?: number
  rotationX?: number
  rotationOrbit?: number
}

export interface AutoNavigation {
  layerId: string,
  condition?: Condition
}

export interface LegendItem {
  color: string,
  label: string
}

export interface Legend {
  layer: string,
  title?: string,
  description?: string,
  items?: LegendItem[]
}

export type Legends = Legend[]

export enum ZoomBehaviorType {
  FIXED = 'FIXED',
  SCALE = 'SCALE',
}

export interface ZoomBehavior {
  x?: ZoomBehaviorType
  y?: ZoomBehaviorType
}

export enum EncodingScope {
  QUERY = 'QUERY',
  FETCH = 'FETCH'
}

/**
 * @description Refresh period in seconds
 */
export type RefreshPeriod = number

export interface BaseVisualization {
  $schema?: string
  createdVersion?: string
  id?: string
  name?: string
  group?: string
  type: VisualizationType
  encodingScope?: EncodingScope
  zoomRange?: FixedZoomRange
  layers?: Layers
  filters?: Filters
  autoNavigation?: AutoNavigation
  legends?: Legends
  zoomBehavior?: ZoomBehavior
  actions?: Actions
  refreshPeriod?: RefreshPeriod
  scope?: string
  historyBack?: boolean
  animationFps?: number
  bleedFactor?: number
  grids?: Grids
  backgroundColor?: string
}

export interface GeoVisualization extends BaseVisualization {
  type: VisualizationType.GEO
  initialPosition?: InitialPosition
}

export interface ChartVisualization extends BaseVisualization {
  type: VisualizationType.CHART
}

export interface ThreeDVisualization extends BaseVisualization {
  type: VisualizationType.THREE_D
  initialPosition?: InitialPosition
  lights?: ThreeDLights
}

export interface CustomVisualization extends BaseVisualization {
  type: VisualizationType.CUSTOM
}

export interface WhiteboardVisualization extends BaseVisualization {
  type: VisualizationType.WHITEBOARD
  initialPosition?: InitialPosition
}

export interface IsometricWhiteboardVisualization extends BaseVisualization {
  type: VisualizationType.ISOMETRIC_WHITEBOARD
  initialPosition?: InitialPosition
}

export type VisualizationSpec =
  GeoVisualization
  | ChartVisualization
  | ThreeDVisualization
  | CustomVisualization
  | WhiteboardVisualization
  | IsometricWhiteboardVisualization

