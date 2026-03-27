import {TransformMode} from './TransformMode/TransformMode'
import {ScaleMode} from './TransformMode/ScaleMode'
import {RotateMode} from './TransformMode/RotateMode'
import {TranslateMode} from './TransformMode/TranslateMode'
import {ModifyMode} from './ModifyMode/ModifyMode'
import {DeckLayerProps} from '../../../DeckLayerFactory'
import {ViewLayerEditingMode} from '../../../ViewLayerStore'
import {OrthographicBounds, RowCoordinates, WebMercatorBounds} from '@hopara/spatial'
import {Columns, FixedRowTranslator, Row, Rows, RowTranslator} from '@hopara/dataset'
import {featureCollection, polygon} from '@turf/helpers'
import {EditCallbackFactory} from '../../interaction/EditCallbackFactory'
import {ColorEncoding} from '@hopara/encoding'
import {DetailsCallbackFactory} from '../../interaction/DetailsCallbackFactory'
import {StrokableFactory} from '../StrokableFactory'
import {OrthographicViewport} from '../../../../view/deck/OrthographicViewport'
import {DistortMode} from './TransformMode/DistortMode'
import {fromString} from '@hopara/encoding/src/color/Colors'
import { EditableGeoJsonLayer } from './EditableGeoJsonLayer'
import { getSelectedRow } from '../../interaction/RowSelection'
import { DeckLayer } from '../../DeckLayer'
import { editHandleIconAtlas, editHandleIconMapping, editHandleIconSizeScale, getEditHandleIcon, getEditHandleIconColor, getEditHandleIconSize } from './EditHandle/EditHandleIcon'
import WebMercatorViewport from '../../../../view/deck/WebMercatorViewport'
import OrbitViewport from '../../../../view/deck/OrbitViewport'
import { memoize } from '@hopara/memoize'

const PolygonTransformMode = new TransformMode([new TranslateMode(), new RotateMode(), new ScaleMode(), new DistortMode()])
const PolygonModifyMode = new ModifyMode()
const selectedFeatureIndexes = [0]
const EDIT_TYPES_TO_COMMIT = [
  'addPosition',
  'distorted',
  'finishMovePosition',
  'removePosition',
  'rotated',
  'scaled',
  'translated',
]

export class EditableGeometryFactory extends StrokableFactory {
  dragging = false

  static getEditingHandlerProps(
    editAccentColor: string,
    viewport: WebMercatorViewport | OrbitViewport | OrthographicViewport | undefined,
    editMode?: ViewLayerEditingMode,
    bounds?: WebMercatorBounds | OrthographicBounds,
  ) {
    const lineProps = {
      getTentativeLineWidth: 2,
      getTentativeLineColor: fromString(editAccentColor),
      lineWidthUnits: 'pixels',
    }

    const angle = bounds ? memoize((bounds, viewporBearing) => {
      const factor = viewport instanceof OrthographicViewport ? 1 : -1
      return ((bounds?.getAngle() ?? 0) - viewporBearing) * factor
    })(bounds, (viewport as any).bearing ?? 0) : 0

    return {
      ...lineProps,
      getTentativeFillColor: [0, 0, 0, 0],
      editHandleType: 'icon',
      editHandleIconAtlas: editHandleIconAtlas(editMode === ViewLayerEditingMode.CROP),
      editHandleIconMapping: editHandleIconMapping(editMode === ViewLayerEditingMode.CROP),
      editHandleIconSizeScale,
      getEditHandleIcon: getEditHandleIcon(editMode === ViewLayerEditingMode.CROP, viewport instanceof OrthographicViewport),
      getEditHandleIconColor: getEditHandleIconColor(editAccentColor),
      getEditHandleIconSize,
      getEditHandleIconAngle: angle,
    }
  }

  getColorProps(color?: ColorEncoding, rows?: Rows, columns?: Columns, rowTranslator?: RowTranslator): any {
    if (color) {
      const colorAccessor = super.getColorAccessor(
        columns,
        color,
        rows,
        rowTranslator)
      return {filled: true, getFillColor: colorAccessor}
    } else {
      return {filled: true, getFillColor: [0, 0, 0, 0]}
    }
  }

  getEditingMode(props: DeckLayerProps) {
    return props.edit.editingMode === ViewLayerEditingMode.MODIFY ? PolygonModifyMode : PolygonTransformMode
  }

  getEditCallback(deckProps: any) {
    return (event) => {
      const bounds = event.updatedData?.features[0].geometry.coordinates[0]
      if (!bounds) return
      const rowCoordinates = new RowCoordinates({geometry: bounds})

      const callbackInfo = {
        layer: {
          props: {pickable: deckProps.pickable, layerId: deckProps.layerId},
        },
        object: event.updatedData?.features[0],
        layerId: deckProps.layerId,
        rowsetId: deckProps.rowsetId,
        index: event.index,
        editType: event.editType,
        bounds,
        coordinate: rowCoordinates.to2DArray(),
        pixel: rowCoordinates.to2DArray(),
        rowCoordinates,
      }
      
      if (EDIT_TYPES_TO_COMMIT.includes(event.editType)) {
        this.dragging = false
        return deckProps.onEditEnd && deckProps.onEditEnd(callbackInfo)
      }
      if (!this.dragging) {
        this.dragging = true
        return deckProps.onEditStart && deckProps.onEditStart(callbackInfo)
      }

      return deckProps.onEdit && deckProps.onEdit(callbackInfo)
    }
  }

  getRowFeature(row: Row) {
    const geometry = row.getCoordinates().getGeometryLike()
    return geometry && geometry.length >= 4 ? polygon([geometry], {rowId: row._id}) : undefined
  }

  getClickCallback(deckProps: any) {
    return (o: any, e: any) => {
      if (o.isGuide) return
      return deckProps.onClick(o, e)
    }
  }

  getRows(props: DeckLayerProps, selectedRow: Row) {
    const rows = new Rows(selectedRow!)
    rows.setEtag(props.rows.getEtag()!)
    rows.updateEtagModifier('editableLayer', selectedRow!._id)
    return rows
  }

  create(props: DeckLayerProps): DeckLayer[] {
    const selectedRow = getSelectedRow(props.rows, props.edit.rowSelection)
    if (!selectedRow) return []

    const rows = this.getRows(props, selectedRow!)

    const rowAsGeoJson = this.getRowFeature(selectedRow!)
    if (!rows.length || !rowAsGeoJson) return []

    const rowTranslator = new FixedRowTranslator(selectedRow!)
    const deckProps = super.getDeckProps(props, {
      id: props.id + '#editable',
      updateTriggers: {
        getFillColor: super.getEncodingUpdateTrigger(props.encoding?.color, rows),
        getLineColor: super.getEncodingUpdateTrigger(props.encoding?.color, rows),
      },
      ...this.getColorProps(
        props.encoding?.color,
        rows,
        props.columns,
        rowTranslator),
      ...super.getStrokeProps(props, rowTranslator),
      ...EditCallbackFactory.createEditCallbacks(this.getEditCallbackProps(props), rowTranslator),
      ...DetailsCallbackFactory.createCallbacks(this.getEditCallbackProps(props).callbacks, this.getEditCallbackProps(props), rowTranslator),
    })

    return [new EditableGeoJsonLayer({
      ...deckProps,
      data: featureCollection([rowAsGeoJson]),
      mode: this.getEditingMode(props),
      selectedFeatureIndexes,
      onClick: this.getClickCallback(deckProps),
      onEdit: this.getEditCallback(deckProps),
      modeConfig: {viewport: props.viewport, screenSpace: props.viewport instanceof OrthographicViewport},
      ...EditableGeometryFactory.getEditingHandlerProps(props.editAccentColor, props.viewport),
    })]
  }
}
