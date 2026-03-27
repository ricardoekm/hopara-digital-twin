import {Row} from '@hopara/dataset'
import {Dimensions} from '@hopara/spatial'
import {createAction} from 'typesafe-actions'

import {FetchProgressPayload} from '@hopara/resource'

export interface ResourceUploadRequest {
  resourceId: string
  library: string
  rowsetId: string
  layerId: string
  row: Row
  file: File
}


export interface ResourceUploadFailure {
  resourceId: string
  library: string
  layerId: string
  reason: string
  exception: Error
}

export interface ResourceHistoryRequest {
  resourceId: string
  library: string
}

export interface ResourceCheckoutRequest {
  row: Row
  rowsetId: string
  version: number
  library: string
  resourceId: string
  layerId: string
}

export interface ResourceRestoreRequest {
  version: number
  layerId: string
  row: Row
  rowsetId: string
  library: string
  resourceId: string
}

export interface ResourceUploadProgress {
  library: string
  resourceId: string
  layerId: string
  progress: number
}

export interface ResourceSuccess {
  dimensions: Dimensions 
  library: string
  resourceId: string
  layerId: string
  row: Row
  rowsetId: string
  version: number
  cascadeToSameKey?: boolean
  shape?: number[][]
  partial?: boolean
}

export const resourceActions = {
  downloadProgress: createAction('RESOURCE_DOWNLOAD_PROGRESS')<FetchProgressPayload>(),
  generateProgress: createAction('RESOURCE_GENERATE_PROGRESS')<{
    library: string,
    resourceId: string,
    progress: number,
  }>(),
  modelProcessed: createAction('RESOURCE_GENERATE_PROCESSED')<{
    library: string,
    resourceId: string,
  }>(),
}

