import { createAction, createAsyncAction } from 'typesafe-actions'
import { Row } from '@hopara/dataset'
import { Dimensions, RowCoordinates } from '@hopara/spatial'
import {
  ResourceHistoryRequest,
  ResourceRestoreRequest,
  ResourceSuccess,
  ResourceUploadFailure,
  ResourceUploadProgress,
  ResourceUploadRequest,
} from './ResourceActions'
import { ResourceHistoryItem } from '@hopara/resource'

export const imageActions = {
  upload: createAsyncAction(
    'IMAGE_UPLOAD_REQUEST',
    'IMAGE_UPLOAD_SUCCESS',
    'IMAGE_UPLOAD_FAILURE'
  )<ResourceUploadRequest, ResourceSuccess, ResourceUploadFailure>(),

  history: createAsyncAction(
    'IMAGE_HISTORY_REQUEST',
    'IMAGE_HISTORY_SUCCESS',
    'IMAGE_HISTORY_FAILURE'
  )<ResourceHistoryRequest, ResourceHistoryItem[], any>(),

  restore: createAsyncAction(
    'IMAGE_RESTORE_REQUEST',
    'IMAGE_RESTORE_SUCCESS',
    'IMAGE_RESTORE_FAILURE'
  )<ResourceRestoreRequest, ResourceSuccess, any>(),
  undo: createAsyncAction('IMAGE_UNDO_REQUESTED', 'IMAGE_UNDO_SUCCESS', 'IMAGE_UNDO_FAILURE')<void, {
    layerId: string,
    rowsetId: string,
    row: Row,
    dimensions: Dimensions,
    resourceId?: string,
    library?: string,
    version: number,
    cascadeToSameKey?: boolean
    shape: number[][]
  }, { exception: Error }>(),
  uploadProgress: createAction('IMAGE_UPLOAD_PROGRESS')<ResourceUploadProgress>(),
  boundsCreated: createAction('IMAGE_BOUNDS_CREATED')<{
    layerId: string
    rowsetId: string,
    row: Row,
    rowCoordinates: RowCoordinates
  }>(),
  saveImageBoundsError: createAction('IMAGE_SAVE_BOUNDS_ERROR')<{ reason: string, exception: Error }>(),
  previewBoundsCreated: createAction('IMAGE_PREVIEW_BOUNDS_CREATED')<{
    layerId: string,
    rowsetId: string,
    row: Row,
    rowCoordinates: RowCoordinates
  }>(),
  crop: createAsyncAction(
    'IMAGE_CROP_REQUEST',
    'IMAGE_CROP_SUCCESS',
    'IMAGE_CROP_FAILURE'
  )<void, {
    imageId: string, resourceId: string, library: string, layerId: string, rowsetId: string,
    row: Row, dimensions: Dimensions, version: number, shape: number[][],
    cascadeToSameKey?: boolean, partial?: boolean
  }, {
    reason: string,
    exception: Error
  }>(),
  generateIsometric: createAsyncAction(
    'IMAGE_GENERATE_ISOMETRIC_REQUEST',
    'IMAGE_GENERATE_ISOMETRIC_SUCCESS',
    'IMAGE_GENERATE_ISOMETRIC_FAILURE'
  )<void, {
    imageId: string, layerId: string, library: string, rowsetId: string, resourceId: string,
    row: Row, dimensions: Dimensions, version: number, cascadeToSameKey?: boolean, shape: number[][]
    canRotate: boolean
  }, {
    library: string,
    resourceId: string,
    reason: string,
    exception: Error,
  }>(),
  generateIsometricWireframe: createAsyncAction(
    'IMAGE_GENERATE_ISOMETRIC_WIREFRAME_REQUEST',
    'IMAGE_GENERATE_ISOMETRIC_WIREFRAME_SUCCESS',
    'IMAGE_GENERATE_ISOMETRIC_WIREFRAME_FAILURE'
  )<void, {
    imageId: string, layerId: string, library: string, rowsetId: string, resourceId: string
    row: Row, dimensions: Dimensions, version: number, cascadeToSameKey?: boolean, shape: number[][]
  }, {
    library: string,
    resourceId: string,
    reason: string,
    exception: Error,
  }>(),
  rotateRequested: createAction('IMAGE_ROTATE_REQUESTED')<{
    view: number,
    rowId: string,
    layerId: string,
    rowsetId: string
  }>(),
}
