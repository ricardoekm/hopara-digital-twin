import {Column, Queries} from '@hopara/dataset'
import {SelectOption} from '@hopara/design-system/src/form/Select'
import {Layer} from '../Layer'
import Visualization from '../../visualization/Visualization'
import {ZoomRange} from '../../zoom/ZoomRange'
import {i18n} from '@hopara/i18n'
import {LayerEditorOwnProps} from './LayerEditor'
import React from 'react'

export type GetFieldOptionsFn = (predicate?: (column: Column) => boolean) => SelectOption[]

export type EditorProps<T> = {
  layer: Layer
  visualization: Visualization
  queries: Queries
  zoom: number
  zoomRange: ZoomRange
  getFieldOptions: GetFieldOptionsFn
  onNew: () => void
  onChange: (value: T) => void
  onPreview: (value: T) => void
  onSubItemClick?: (id: string, layerId?: string) => void
}

export type EditorItemProps<T> = {
  layer: Layer
  getFieldOptions: GetFieldOptionsFn
  selectedItemId: string
  onChange: (value: T) => void
  onBack: () => void
}

export enum LayerEditorType {
  name = 'name',
  type = 'type',
  data = 'data',
  transform = 'data.transform',
  encodingPosition = 'encoding.position',
  encodingOffset = 'encoding.offset',
  children = 'children',
  encodingArc = 'encoding.arc',
  encodingImage = 'encoding.image',
  encodingIcon = 'encoding.icon',
  encodingModel = 'encoding.model',
  encodingText = 'encoding.text',
  encodingSize = 'encoding.size',
  encodingMultiplier = 'encoding.multiplier',
  encodingColor = 'encoding.color',
  encodingShadow = 'encoding.shadow',
  encodingBorderColor = 'encoding.strokeColor',
  encodingBorderSize = 'encoding.strokeSize',
  animation = 'animation',
  visible = 'visible',
  details = 'details',
  actions = 'actions',
  encodingLine = 'encoding.line',
  encodingMap = 'encoding.map',
  template = 'template',
  encodingPolygon = 'encoding.polygon',
}

export enum EditorGroup {
  meta = 'meta',
  data = 'data',
  appearance = 'appearance',
  animation= 'animation',
  visibility = 'visibility',
  position = 'position',
  positionOffset = 'positionOffset',
  details = 'details',
  actions = 'actions',
  childLayers = 'childLayers',
}

export const groupHelperText = {
  [EditorGroup.details]: i18n('DETAILS_GROUP_HELPER'),
  [EditorGroup.actions]: i18n('ACTIONS_GROUP_HELPER'),
}

export enum FieldOptionsType {
  QUERY = 'QUERY',
  DEFAULT = 'DEFAULT',
  POSITION_QUERY = 'POSITION_QUERY'
}

export class LayerEditorFactory {
  key: LayerEditorType
  group: EditorGroup
  create: React.FunctionComponent<LayerEditorOwnProps>
  createItem: React.FunctionComponent<LayerEditorOwnProps>

  getGroup(_layer: Layer): string {
    return this.group
  }

  getAliases(items?: string[]) {
    return (items ?? []).concat(this.key)
  }
}
