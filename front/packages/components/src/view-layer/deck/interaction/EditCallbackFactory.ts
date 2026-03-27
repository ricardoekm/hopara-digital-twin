import {Row, RowTranslator} from '@hopara/dataset'
import {LayerInputHandler, ScenegraphLayer} from 'deck.gl'
import {DetailsCallbackFactory} from './DetailsCallbackFactory'
import {RowCoordinates} from '@hopara/spatial'
import {isNil} from 'lodash/fp'
import {CursorDisplacement, InteractionCallbacks, InteractionInfo, InteractionSource} from './Interaction'
import {RowEdit, RowEditType} from './RowEdit'
import {polygon as turfPolygon} from '@turf/helpers'
import { geometricFromViewport } from '../../../geometric/GeometricFactory'

export type EditCallbacks = {
  onDragStart?: LayerInputHandler;
  onDrag?: LayerInputHandler;
  onDragEnd?: LayerInputHandler;
  onEditStart?: LayerInputHandler;
  onEdit?: LayerInputHandler;
  onEditEnd?: LayerInputHandler
  onCropEdit?: LayerInputHandler
  onCropEditEnd?: LayerInputHandler
}

export type EditCallbackProps = {
  editable: boolean,
  rowEdit?: RowEdit,
  callbacks: InteractionCallbacks
} & InteractionSource

export class EditCallbackFactory {
  static getCursorDisplacement(props: EditCallbackProps, coordinate?: [number, number, number?], row?: Row): CursorDisplacement | undefined {
    if (props.rowEdit?.cursorDisplacement) return props.rowEdit?.cursorDisplacement
    if (!coordinate || !row) return

    const x = row.getCoordinates().getCentroidX()
    const y = row.getCoordinates().getCentroidY()
    const displacement: CursorDisplacement = {x: coordinate[0] - x, y: coordinate[1] - y}
    if (!isNil(coordinate[2]) && !isNil(row.getCoordinates().getCentroidZ())) {
      displacement.z = coordinate[2] - row.getCoordinates().getCentroidZ()
    }
    return displacement
  }

  private static getTranslatedCoordinates(info: any, row: Row, cursorDisplacement?: CursorDisplacement): RowCoordinates {
    const fixedCoordinate = [
      info.coordinate[0] - (cursorDisplacement?.x ?? 0),
      info.coordinate[1] - (cursorDisplacement?.y ?? 0),
    ]

    const geometric = geometricFromViewport(info.viewport)
    const polygon = turfPolygon([row.getCoordinates().getGeometryLike()])
    const coords = geometric.translateToCoordinates(polygon, fixedCoordinate)

    return row.getCoordinates().hasGeometry() ? new RowCoordinates({geometry: coords}) : new RowCoordinates({x: coords, y: coords})
  }

  private static needsToBeTranslated(row: Row): boolean {
    return row.getCoordinates().isGeometryLike() && row.getCoordinates().getGeometryLike().length > 1
  }

  private static shouldUseLastRowCoordinates(info: any, row?: Row): boolean {
    if (info.layer instanceof ScenegraphLayer) return false
    const isTranslatedEvent = info.editType === 'translated' || info.editType === 'dragged'
    return isTranslatedEvent && !!row?.getCoordinates()
  }

  private static getRowCoordinates(info: any, cursorDisplacement?: CursorDisplacement, row?: Row): RowCoordinates {
    if (this.shouldUseLastRowCoordinates(info, row)) return row!.getCoordinates()
    if (info.rowCoordinates) return info.rowCoordinates
    if (info.bounds) return new RowCoordinates({geometry: info.bounds})
    if (row && this.needsToBeTranslated(row)) return this.getTranslatedCoordinates(info, row, cursorDisplacement)
    if (!cursorDisplacement) return RowCoordinates.fromArray(info.coordinate)

    const fixedCoordinate = [
      info.coordinate[0] - cursorDisplacement.x,
      info.coordinate[1] - cursorDisplacement.y,
    ]

    if (!isNil(info.coordinate[2])) {
      fixedCoordinate.push(info.coordinate[2] - (cursorDisplacement.z ?? 0))
    }

    return RowCoordinates.fromArray(fixedCoordinate)
  }

  private static getEditType(info: any): RowEditType {
    switch (info.editType) {
      case 'translate':
      case 'translating':
      case 'translated':
      case 'dragging':
      case 'dragged':
        return RowEditType.TRANSLATE
      case 'scale':
      case 'scaling':
      case 'scaled':
        return RowEditType.SCALE
      case 'rotate':
      case 'rotating':
      case 'rotated':
        return RowEditType.ROTATE
      case 'extrude':
      case 'extruding':
      case 'extruded':
        return RowEditType.EXTRUDE
      case 'distort':
      case 'distorting':
      case 'distorted':
        return RowEditType.DISTORT
      default:
        return RowEditType.NONE
    }
  }

  static getInteractionInfo(info: any, props: EditCallbackProps, rowTranslator?: RowTranslator): InteractionInfo | undefined {
    const detailsInteractionInfo = DetailsCallbackFactory.getDetailsInteractionInfo(info, props, rowTranslator)
    if (!detailsInteractionInfo || !info.coordinate) {
      return
    }

    if (info.layer.props.layerId !== props.layerId) return
    const cursorDisplacement = this.getCursorDisplacement(props, info.coordinate, detailsInteractionInfo.row)
    const rowCoordinates: RowCoordinates = this.getRowCoordinates(info, cursorDisplacement, detailsInteractionInfo.row)

    return {
      ...detailsInteractionInfo,
      editType: this.getEditType(info),
      rowCoordinates,
      editable: props.editable,
      cursorDisplacement,
    }
  }

  static createEditCallbacks(props: EditCallbackProps, rowTranslator?: RowTranslator) {
    return {
      onEditStart: (info) => {
        return props.callbacks.onEditStart && props.callbacks.onEditStart(
          this.getInteractionInfo(info, props, rowTranslator),
        )
      },
      onEdit: (info) => {
        return props.callbacks.onEdit && props.callbacks.onEdit(
          this.getInteractionInfo(info, props, rowTranslator),
        )
      },
      onEditEnd: (info) => {
        return props.callbacks.onEditEnd && props.callbacks.onEditEnd(
          this.getInteractionInfo(info, props, rowTranslator),
        )
      },
      onCropEdit: (info) => {
        return props.callbacks.onCropEdit && props.callbacks.onCropEdit(info)
      },
      onCropEditEnd: (info) => {
        return props.callbacks.onCropEditEnd && props.callbacks.onCropEditEnd(info)
      },
      onUpdateCursor: (cursor: string | null) => {
        return props.callbacks.onUpdateCursor && props.callbacks.onUpdateCursor(cursor)
      },
    }
  }

  static createCallbacks(props: EditCallbackProps, rowTranslator?: RowTranslator): EditCallbacks {
    if (!props.editable) {
      return {}
    }

    return {
      onDragStart: (info) => {
        return props.callbacks.onDragStart && props.callbacks.onDragStart(
          this.getInteractionInfo({...info, editType: 'dragging'}, props, rowTranslator),
        )
      },
      onDrag: (info) => {
        return props.callbacks.onDrag && props.callbacks.onDrag(
          this.getInteractionInfo({...info, editType: 'dragging'}, props, rowTranslator),
        )
      },
      onDragEnd: (info) => {
        return props.callbacks.onDragEnd && props.callbacks.onDragEnd(
          this.getInteractionInfo({...info, editType: 'dragged'}, props, rowTranslator),
        )
      },
      ...this.createEditCallbacks(props, rowTranslator),
    }
  }
}
