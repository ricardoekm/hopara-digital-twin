import { ConfigEnvironment } from '@hopara/config'
import { FilterSet, Row } from '@hopara/dataset'
import { Position } from '@hopara/components/src/view-state/ViewState'
import { SelectedFilter } from '@hopara/components/src/filter/domain/SelectedFilter'
import { InitialRow } from '@hopara/components/src/initial-row/InitialRow'
import { PlainError } from '@hopara/dataset/src/repository/LoaderDatasetRepository'
import { PlainDataLoader } from '@hopara/dataset/src/loader/DataLoader'
import { HoparaTab } from '../view/Provider'
import { Language } from '@hopara/browser'
import { Coordinates } from '@hopara/spatial'

export enum EventType {
  INIT = 'init',
  READY = 'ready',
  UPDATE = 'update',
  LOAD_DATA = 'loadData',
  LOAD_DATA_RESPONSE = 'loadDataResponse',
  UPDATE_DATA = 'updateData',
  UPDATE_DATA_RESPONSE = 'updateDataResponse',
  REFRESH = 'refresh',
  FUNCTION_CALLBACK = 'functionCallback',
}

export const HOPARA_EVENT_TYPE = '__hopara__eventType__'

export interface EventData {
  [HOPARA_EVENT_TYPE]?: EventType
}

export interface InitData extends EventData {
  accessToken?: string
  refreshToken?: string
  visualizationId?: string
  fallbackVisualizationId?: string
  visualizationScope?: string
  tenant?: string
  env?: ConfigEnvironment
  initialPosition?: Position
  initialRow?: InitialRow
  dataLoaders?: PlainDataLoader[]
  darkMode?: boolean
  callbackNames?: string[]
  filters?: Partial<SelectedFilter>[]
  language?: Language | `${Language}`
  initialTab?: HoparaTab | `${HoparaTab}`
  navigationControls?: boolean
}

export interface LoadDataRequestData extends EventData {
  data: {
    query: string
    source: string
  }
  filterSet: FilterSet
}

export interface LoadDataResponseData extends EventData {
  data: {
    query: string
    source: string
  }
  rows: any[]
  columns: any[]
  error?: PlainError
}

export interface CallbackFunctionData extends EventData {
  name: string
  row: Row
  pixel?: Coordinates
}

export interface PostMessageEvent<D> extends MessageEvent {
  origin: string
  data: D
}

export const isReadyEvent = (event: PostMessageEvent<EventData>): event is PostMessageEvent<EventData> => {
  return event.data[HOPARA_EVENT_TYPE] === EventType.READY
}

export const isLoadDataEvent = (event: PostMessageEvent<EventData>): event is PostMessageEvent<LoadDataRequestData> => {
  return event.data[HOPARA_EVENT_TYPE] === EventType.LOAD_DATA
}

export const isCallbackFunctionEvent = (event: PostMessageEvent<EventData>): event is PostMessageEvent<CallbackFunctionData> => {
  return event.data[HOPARA_EVENT_TYPE] === EventType.FUNCTION_CALLBACK
}
