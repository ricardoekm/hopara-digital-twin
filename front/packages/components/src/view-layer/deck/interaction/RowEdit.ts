import { Row } from '@hopara/dataset'
import { CursorDisplacement, InteractionSource } from './Interaction'

export enum RowEditType {
  TRANSLATE = 'TRANSLATE',
  SCALE = 'SCALE',
  ROTATE = 'ROTATE',
  EXTRUDE = 'EXTRUDE',
  DISTORT = 'DISTORT',
  NONE = 'NONE',
}

export type RowEdit = {
  row: Row
  cursorDisplacement?: CursorDisplacement
  cropGeometry?: any
  editType?: RowEditType
} & InteractionSource
