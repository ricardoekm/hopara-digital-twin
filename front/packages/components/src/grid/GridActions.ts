import { SizeEncoding } from '@hopara/encoding'
import {createAction} from 'typesafe-actions'
import { Grid } from './Grid'

export const gridActions = {
  sizeChanged: createAction('GRID_SIZE_CHANGED')<{layerId: string, encoding: SizeEncoding}>(),
  strokeSizeChanged: createAction('GRID_STROKE_SIZE_CHANGED')<{layerId:string, encoding: SizeEncoding}>(),
  enable: createAction('GRID_ENABLE')<{layerId: string}>(),
  codeChanged: createAction('GRID_CODE_CHANGED')<{code: Grid[]}>(),
}
