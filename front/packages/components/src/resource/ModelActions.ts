import {createAction, createAsyncAction} from 'typesafe-actions'

import {
  ResourceCheckoutRequest,
  ResourceHistoryRequest,
  ResourceRestoreRequest,
  ResourceSuccess,
  ResourceUploadFailure,
  ResourceUploadProgress,
  ResourceUploadRequest,
} from './ResourceActions'
import {ResourceHistoryItem} from '@hopara/resource'

export const modelActions = {
  upload: createAsyncAction(
    'MODEL_UPLOAD_REQUEST',
    'MODEL_UPLOAD_SUCCESS',
    'MODEL_UPLOAD_FAILURE',
  )<ResourceUploadRequest, ResourceSuccess, ResourceUploadFailure>(),

  history: createAsyncAction(
    'MODEL_HISTORY_REQUEST',
    'MODEL_HISTORY_SUCCESS',
    'MODEL_HISTORY_FAILURE',
  )<ResourceHistoryRequest, ResourceHistoryItem[], any>(),

  checkout: createAsyncAction(
    'MODEL_CHECKOUT_REQUEST',
    'MODEL_CHECKOUT_SUCCESS',
    'MODEL_CHECKOUT_FAILURE',
  )<ResourceCheckoutRequest, ResourceSuccess, any>(),

  restore: createAsyncAction(
    'MODEL_RESTORE_REQUEST',
    'MODEL_RESTORE_SUCCESS',
    'MODEL_RESTORE_FAILURE',
  )<ResourceRestoreRequest, ResourceSuccess, any>(),

  undo: createAsyncAction(
    'MODEL_UNDO_REQUESTED',
    'MODEL_UNDO_SUCCESS',
    'MODEL_UNDO_FAILURE',
  )<void, ResourceSuccess, { exception: Error }>(),

  uploadProgress: createAction('MODEL_UPLOAD_PROGRESS')<ResourceUploadProgress>(),
}
