import {createAction, createAsyncAction} from 'typesafe-actions'
import {Layer} from '../Layer'
import {Queries, Query} from '@hopara/dataset'
import {Visible} from '../Visible'
import {Encoding} from '@hopara/encoding/src/Encoding'
import {Action} from '../../action/Action'
import { Data, PositionType, Transform } from '@hopara/encoding'
import { LayerType } from '../LayerType'
import { OffsetEncoding } from '@hopara/encoding/src/offset/OffsetEncoding'
import { Layers } from '../Layers'

interface ToggleVisibilityPayload {
  id: string;
  visible: Visible,
}

interface QueryChangedPayload {
  id: string
  query: Query
}

interface NewLayerRequestPayload {
  type: string,
  partialLayer?: Partial<Layer>
  parentId?: string
}

interface NewHoparaManagedLayerRequestPayload {
  layer:Layer
  data: Data
}

interface NewHoparaManagedLayerSuccessPayload {
  layer:Layer,
  queries: Queries
}

interface EncodingChangedPayload {
  layerId: string
  encoding: Encoding
  type: string
}

interface OffsetEncodingChangedPayload {
  layerId: string
  encoding: Partial<OffsetEncoding>
}

interface PositionTypeChangedPayload {
  layerId: string
  type: PositionType
}


interface EncodingPreviewPayload {
  layerId: string
  encoding?: Encoding
  type: string
}

interface TypeChangedPayload {
  id: string
  type: LayerType
}

const actions = {
  selected: createAction('LAYER_SELECTED')<{ id?: string }>(),
  moved: createAction('LAYER_MOVED')<{ id: string, steps: number }>(),
  deleted: createAction('LAYER_DELETED')<{ id: string }>(),
  changed: createAction('LAYER_CHANGED')<{ id: string, change: Partial<Layer> }>(),
  orderChanged: createAction('LAYER_ORDER_CHANGED')<{ layerId: string, children: Layers }>(),
  advancedModeClick: createAction('LAYER_ADVANCED_MODE_CLICK')<{ enabled: boolean }>(),
  visibilityChanged: createAction('LAYER_VISIBILITY_CHANGED')<ToggleVisibilityPayload>(),
  transformChanged: createAction('LAYER_TRANSFORM_CHANGED')<{ id: string, transform?: Transform }>(),
  queryChanged: createAction('LAYER_QUERY_CHANGED')<QueryChangedPayload>(),
  dataSourceChanged: createAction('LAYER_DATA_SOURCE_CHANGED')<{ id: string, dataSource: string }>(),
  typeChanged: createAction('LAYER_TYPE_CHANGED')<TypeChangedPayload>(),
  sizeEncodingChanged: createAction('LAYER_SIZE_ENCODING_CHANGED')<EncodingChangedPayload>(),
  offsetEncodingChanged: createAction('LAYER_OFFSET_ENCODING_CHANGED')<OffsetEncodingChangedPayload>(),
  encodingChanged: createAction('LAYER_ENCODING_CHANGED')<EncodingChangedPayload>(),
  animationChanged: createAction('LAYER_ANIMATION_CHANGED')<EncodingChangedPayload>(),
  positionTypeChanged: createAction('LAYER_POSITION_TYPE_CHANGED')<PositionTypeChangedPayload>(),
  resizeChanged: createAction('LAYER_RESIZE_CHANGED')<{resize: boolean, layerId: string}>(),
  positionEncodingChanged: createAction('LAYER_POSITION_ENCODING_CHANGED')<EncodingChangedPayload>(),
  encodingPreview: createAction('LAYER_ENCODING_PREVIEW')<EncodingPreviewPayload>(),
  created: createAction('LAYER_CREATED')<NewLayerRequestPayload>(),
  toHoparaManaged: createAsyncAction('HOPARA_MANAGED_LAYER_CREATE_REQUEST',
    'HOPARA_MANAGED_LAYER_CREATE_SUCCESS',
    'HOPARA_MANAGED_LAYER_CREATE_FAILURE',
  )<NewHoparaManagedLayerRequestPayload, NewHoparaManagedLayerSuccessPayload, any>(),
  codeChanged: createAction('LAYER_CODE_CHANGED')<{ layer: Layer }>(),
  openGroupsChanged: createAction('LAYER_OPEN_GROUPS_CHANGED')<{ groups: string[] }>(),
  duplicated: createAction('LAYER_DUPLICATED')<{ layerId: string }>(),
  selectAction: createAction('LAYER_SELECT_ACTION')<{ actionId?: string }>(),
  actionChanged: createAction('LAYER_ACTION_CHANGED')<{ action: Action }>(),
  newActionRequested: createAction('LAYER_NEW_ACTION_REQUESTED')<void>(),
  actionDeleted: createAction('LAYER_ACTION_DELETED')<{ actionId: string }>(),
  actionMoved: createAction('LAYER_ACTION_MOVED')<{ sourceIndex: number, destinationIndex: number }>(),
  selectDetailsField: createAction('LAYER_SELECT_DETAILS_FIELD')<{ field?: string }>(),
  ejectRequested: createAction('LAYER_EJECT_REQUESTED')<{ id: string }>(),
}


export default actions
