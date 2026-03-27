import {Row} from '@hopara/dataset'
import { Coordinates, RowCoordinates } from '@hopara/spatial'
import { RowEditType } from './RowEdit'

export type InteractionSource = {
  layerId: string,
  parentId?: string
  rowsetId: string
}

export type CursorDisplacement = {
  x: number
  y: number
  z?: number
}
export type DetailsInteractionInfo = {
  row: Row
  pixel: Coordinates
} & InteractionSource

export type InteractionInfo = {
  updatedData?: any
  coordinates?: Coordinates
  rowCoordinates: RowCoordinates
  editable?: boolean
  cursorDisplacement?: CursorDisplacement
  editType?: RowEditType
} & DetailsInteractionInfo

export type InteractionCallbacks = {
  onHover?: (info?: DetailsInteractionInfo) => void
  onClick?: (info?: DetailsInteractionInfo) => void
  onDragStart?: (info?: InteractionInfo) => void
  onDrag?: (info?: InteractionInfo) => void
  onDragEnd?: (info?: InteractionInfo) => void
  onEditStart?: (info?: InteractionInfo) => void
  onEdit?: (info?: InteractionInfo) => void
  onEditEnd?: (info?: InteractionInfo) => void
  onCropEdit?: (info?: InteractionInfo) => void
  onCropEditEnd?: (info?: InteractionInfo) => void
  onUpdateCursor: (cursor: string | null) => void
}
