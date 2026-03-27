import { Row } from '@hopara/dataset'
import { createAsyncAction } from 'typesafe-actions'

export type FitRequestPayload = {
  layerId: string,
  row: Row
  rowsetId: string
}

export interface FitToCropPayload {
  fitBox: any,
  layerId: string,
  row: Row,
  rowsetId: string
}

export const fitActions = {
  fitToImage: createAsyncAction(
    'FIT_TO_IMAGE_REQUEST',
    'FIT_TO_IMAGE_SUCCESS',
    'FIT_TO_IMAGE_FAILURE',
  )<FitRequestPayload, void, {exception: Error}>(),
  fitToRoom: createAsyncAction(
    'FIT_TO_ROOM_REQUEST',
    'FIT_TO_ROOM_SUCCESS',
    'FIT_TO_ROOM_FAILURE',
  )<FitRequestPayload, void, {exception: Error}>(),
  fitToBuilding: createAsyncAction(
    'FIT_TO_BUILDING_REQUEST',
    'FIT_TO_BUILDING_SUCCESS',
    'FIT_TO_BUILDING_FAILURE',
  )<FitRequestPayload, void, {exception: Error}>(),
  fitToCrop: createAsyncAction(
    'FIT_TO_CROP_REQUEST',
    'FIT_TO_CROP_SUCCESS',
    'FIT_TO_CROP_FAILURE',
  )<void, FitToCropPayload, FitToCropPayload & {exception: Error}>(),
}
