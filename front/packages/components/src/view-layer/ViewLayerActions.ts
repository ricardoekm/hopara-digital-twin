import {createAction} from 'typesafe-actions'
import {Row} from '@hopara/dataset'
import {Coordinates, RowCoordinates} from '@hopara/spatial'
import { CursorDisplacement } from './deck/interaction/Interaction'
import { PageNavigation } from '@hopara/page/src/PageNavigation'

export interface LayerPayload {
  layerId: string,
  parentId: string | undefined
  row: Row
  rowIndex?: number
  rowsetId: string,
  pixel?: Coordinates
  cursorDisplacement?: CursorDisplacement
}

export interface LayerSavePayload extends LayerPayload{
  rowCoordinates: RowCoordinates
}

export interface LayerClickPayload extends LayerPayload {
  navigation: PageNavigation
}

export interface LayerHoverPayload extends LayerPayload {
  navigation: PageNavigation
}

export interface LayerLeftPayload {
  navigation: PageNavigation
}


export const viewLayerActions = {
  dragStarted: createAction('VIEW_LAYER_DRAG_STARTED')<LayerPayload>(),
  dragEnded: createAction('VIEW_LAYER_DRAG_ENDED')<LayerSavePayload>(),
  click: createAction('VIEW_LAYER_CLICK')<LayerClickPayload>(),
  clickOut: createAction('VIEW_LAYER_CLICK_OUT')<void>(),
  mouseHover: createAction('VIEW_LAYER_MOUSE_HOVER')<LayerHoverPayload>(),
  mouseLeft: createAction('VIEW_LAYER_MOUSE_LEFT')<LayerLeftPayload>(),
  cropEditEnd: createAction('VIEW_LAYER_CROP_EDIT_END')<LayerPayload & {bounds: any}>(),
  cropCancelClicked: createAction('VIEW_LAYER_CROP_CANCEL_CLICKED')<void>(),
  cropApplyClicked: createAction('VIEW_LAYER_CROP_APPLY_CLICKED')<void>(),
}
