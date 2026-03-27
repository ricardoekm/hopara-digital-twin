import {VisualizationType} from '../visualization/Visualization'

export enum LayerType {
  composite = 'composite',
  circle = 'circle',
  icon = 'icon',
  image = 'image',
  line = 'line',
  polygon = 'polygon',
  text = 'text',
  model = 'model',
  bar = 'bar',
  arc = 'arc',
  area = 'area',
  rectangle = 'rectangle',
  map = 'map',
  template = 'template'
}

export type LayerTypeStr = 'LAYER_CIRCLE' |
  'LAYER_ICON' |
  'LAYER_IMAGE' |
  'LAYER_LINE' |
  'LAYER_POLYGON' |
  'LAYER_TEXT' |
  'LAYER_MODEL' |
  'LAYER_TABLE' |
  'LAYER_BAR' |
  'LAYER_ARC' |
  'LAYER_AREA' |
  'LAYER_COMPOSITE'

export const geoLayerTypes = [
  LayerType.circle,
  LayerType.icon,
  LayerType.image,
  LayerType.line,
  LayerType.polygon,
  LayerType.text,
  LayerType.composite,
  LayerType.map,
  LayerType.template,
]

export const whiteboardLayerTypes = [
  LayerType.circle,
  LayerType.icon,
  LayerType.image,
  LayerType.line,
  LayerType.polygon,
  LayerType.text,
  LayerType.template,
  LayerType.composite,
]

export const chartLayerTypes = [
  LayerType.circle,
  LayerType.icon,
  LayerType.line,
  LayerType.text,
  LayerType.bar,
  LayerType.arc,
  LayerType.rectangle,
  LayerType.area,
  LayerType.composite,
]

export const threeDLayerTypes = [LayerType.model,
  LayerType.circle,
  LayerType.icon,
  LayerType.text,
  LayerType.composite,
  LayerType.template
]

export const composableLayerTypes = [
  LayerType.circle, LayerType.icon, LayerType.text,
]

export const DefaultLayerTypeByWorld = {
  [VisualizationType.CHART]: LayerType.line,
  [VisualizationType.GEO]: LayerType.circle,
  [VisualizationType.THREE_D]: LayerType.model,
  [VisualizationType.WHITEBOARD]: LayerType.circle,
  [VisualizationType.ISOMETRIC_WHITEBOARD]: LayerType.circle,
}

export function getLayerTypesByVisualization(visualizationType:VisualizationType): LayerType[] {
  if (VisualizationType.CHART === visualizationType) {
    return [...chartLayerTypes].sort()
  }
  if (VisualizationType.THREE_D === visualizationType) {
    return [...threeDLayerTypes].sort()
  }
  if (VisualizationType.WHITEBOARD === visualizationType) {
    return whiteboardLayerTypes
  }

  return geoLayerTypes
}
