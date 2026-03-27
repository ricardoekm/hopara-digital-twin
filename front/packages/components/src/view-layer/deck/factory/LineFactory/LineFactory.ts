import {isUndefined, omitBy} from 'lodash/fp'
import {BaseFactory} from '../BaseFactory'
import {DeckLayer} from '../../DeckLayer'
import {LineLayer} from './LineLayer'
import {Columns, EditableFeatureRowTranslator, Row, Rows, RowTranslator} from '@hopara/dataset'
import {LineCap} from '@hopara/encoding/src/line/LineEncoding'
import {DeckLayerProps} from '../../../DeckLayerFactory'
import {featureCollection, lineString} from '@turf/helpers'
import {ModifyMode} from '../EditableFactory/ModifyMode/ModifyMode'
import {OrthographicViewport} from '../../../../view/deck/OrthographicViewport'
import {ColorEncoding, testCondition} from '@hopara/encoding'
import { RowCoordinates } from '@hopara/spatial'
import { WebMercatorViewport } from 'deck.gl'
import { getTimelineData } from './TimelineFactory'
import { CallbacksFactory } from '../../interaction/CallbacksFactory'
import { getSelectedRowIndex } from '../../interaction/RowSelection'
import { EditableGeometryFactory } from '../EditableFactory/EditableGeometryFactory'
import { ViewLayerEditingMode } from '../../../ViewLayerStore'
import { TransformMode } from '../EditableFactory/TransformMode/TransformMode'
import { TranslateMode } from '../EditableFactory/TransformMode/TranslateMode'
import { RotateMode } from '../EditableFactory/TransformMode/RotateMode'
import { ScaleMode } from '../EditableFactory/TransformMode/ScaleMode'
import { DistortMode } from '../EditableFactory/TransformMode/DistortMode'
import {DEFAULT_SEGMENT_LENGTH} from '../../../../layer/EncodingAnimation'
import { EditableGeoJsonLayer } from '../EditableFactory/EditableGeoJsonLayer'
import { Internals } from '@hopara/internals'
import { DEFAULT_ANIMATION_SPEED } from '../../../../layer/animation/AnimationSpeed'

const LineModifyMode = new ModifyMode()
const LineTransformMode = new TransformMode([new TranslateMode(), new RotateMode(), new ScaleMode(), new DistortMode()])

export class LineFactory extends BaseFactory<DeckLayerProps> {
  dragging = false

  getEditCallback(props: any) {
    return (event) => {
      const index = event.index ?? event.editContext?.featureIndexes[0]
      const bounds = event.updatedData?.features[index].geometry.coordinates
      if (!bounds || (bounds && bounds.length < 2)) return
      const rowCoordinates = new RowCoordinates({geometry: bounds})

      const callbackInfo = {
        layer: {
          props: {pickable: props.pickable, layerId: props.layerId},
        },
        object: event.updatedData?.features[index],
        layerId: props.layerId,
        rowsetId: props.rowsetId,
        index,
        editType: event.editType,
        bounds,
        coordinate: rowCoordinates.to2DArray(),
        pixel: rowCoordinates.to2DArray(),
      }

      if (['translated', 'scaled', 'rotated', 'extruded', 'finishMovePosition', 'addPosition', 'removePosition'].indexOf(event.editType) > -1) {
        this.dragging = false
        return props.onEditEnd && props.onEditEnd(callbackInfo)
      }

      if (!this.dragging) {
        this.dragging = true
        return props.onEditStart && props.onEditStart(callbackInfo)
      }

      return props.onEdit && props.onEdit(callbackInfo)
    }
  }

  getStrokeSizeProps(
    props: DeckLayerProps,
    rowTranslator?: RowTranslator,
  ): any {
    if (!props.encoding.size) {
      return {}
    }

    const strokeProps = {
      lineWidthScale: 1,
      getLineWidth: super.getSizeAccessor(
        props.rows,
        props.encoding.size,
        rowTranslator,
      ),
      lineWidthUnits: props.encoding.getUnits(),
      lineWidthMaxPixels: super.getMaxPixels(props.viewport, props.encoding.size, props.encoding.config),
      stroke: true,
    }

    return strokeProps
  }

  getColorStrokeProps(color?: ColorEncoding, rows?: Rows, columns?: Columns, rowTranslator?: RowTranslator): any {
    if (!color) {
      return {}
    }

    const colorAccessor = super.getColorAccessor(
      columns,
      color,
      rows,
      rowTranslator)
    return {getLineColor: colorAccessor}
  }


  private getGeometry(props: DeckLayerProps, row: Row) {
    return row.getCoordinates().hasGeometry() ? lineString(row.getCoordinates().getGeometryLike(), {rowId: row._id}) : undefined
  }

  getEditingMode(props: DeckLayerProps) {
    return props.edit.editingMode === ViewLayerEditingMode.MODIFY ? LineModifyMode : LineTransformMode
  }

  createEditableLineLayer(props: DeckLayerProps): DeckLayer {
    const rowTranslator = new EditableFeatureRowTranslator(props.rows)

    const deckProps = super.getDeckProps(props, {
      rowsetId: props.rowsetId,
      pickable: props.edit.pickable,
      ...CallbacksFactory.create(this.getEditCallbackProps(props), rowTranslator),
      _subLayerProps: {
        geojson: omitBy(isUndefined, {
          getFillColor: this.getColorAccessor(props.columns, props.encoding?.color, props.rows),
          ...this.getStrokeSizeProps(props, rowTranslator),
          ...this.getColorStrokeProps(props.encoding?.color, props.rows, props.columns, rowTranslator),
          lineCapRounded: props.encoding.line?.cap === LineCap.ROUND,
          lineJointRounded: true,
        }),
      },
      ...EditableGeometryFactory.getEditingHandlerProps(props.editAccentColor, props.viewport),
    })

    const rowsAsGeometryObject = props.rows.map((row) => this.getGeometry(props, row))
                                           .filter((row) => !!row)
    const data = featureCollection(rowsAsGeometryObject as any)
    const selectedRowIndex = getSelectedRowIndex(props.rows, props.edit.rowSelection)

    return new EditableGeoJsonLayer({
      ...deckProps,
      id: props.id + '#editable',
      data,
      mode: this.getEditingMode(props),
      selectedFeatureIndexes: props.edit.rowSelection && selectedRowIndex >= 0 ? [selectedRowIndex] : undefined,
      modeConfig: {viewport: props.viewport, screenSpace: props.viewport instanceof OrthographicViewport},
      onEdit: this.getEditCallback(deckProps),
      getTentativeFillColor: [0, 0, 0, 0],
      onClick: (...props) => {
        if ((props[0] as any)?.isGuide) return
        return deckProps.onClick && deckProps.onClick(...props)
      },
      onDragStart: undefined,
      onDrag: undefined,
      onDragEnd: undefined,
    })
  }

  createLineLayer(props: DeckLayerProps): DeckLayer {
    const data = props.rows
    const segmentLength = props.encoding.line?.segmentLength ?? DEFAULT_SEGMENT_LENGTH
    const speed = (props.encoding?.animation?.speed ?? DEFAULT_ANIMATION_SPEED) / 4
    const timelineData = getTimelineData(data, speed * segmentLength, props.viewport instanceof WebMercatorViewport)

    const deckProps = super.getDeckProps(props, {
      id: props.id,
      layerId: props.layerId,
      data,
      getPath: (row: Row) => row.getCoordinates().getGeometryLike(),
      getIsAnimated: (row: Row) => {
        const animationEncoding = props.encoding?.animation
        if (!animationEncoding || Internals.getParam('animate') === false) return 0
        if (!animationEncoding.enabled) return 0

        return testCondition(animationEncoding.condition, row, true) ? 1 : 0
      },
      getColor: this.getColorAccessor(props.columns, props.encoding?.color, props.rows),
      capRounded: props.encoding.line?.cap === LineCap.ROUND,
      jointRounded: true,
      widthUnits: props.encoding?.getUnits(),
      getWidth: super.getSizeAccessor(
        props.rows,
        props.encoding?.size,
      ),
      widthMaxPixels: super.getMaxPixels(props.viewport, props.encoding?.size, props.encoding?.config),
      speed,
      segmentLength,
      updateTrigger: {
        getColor: super.getEncodingUpdateTrigger(props.encoding.color, props.rows),
        getWidth: super.getEncodingUpdateTrigger(props.encoding.size, props.rows),
        getPath: super.getPositionUpdateTrigger(props.encoding.position, props.edit.isDragging, props.rows),
      },
      pickable: props.edit.pickable,
      getTimestamps: timelineData.timestampFn,
      animationType: props.encoding.animation?.type,
      animations: [{
        channel: {duration: timelineData.durationMs, repeat: Number.POSITIVE_INFINITY},
        keyFrames: {
          '0%': {currentTime: 0},
          '100%': {currentTime: timelineData.durationMs},
        },
      }],
      ...CallbacksFactory.create(this.getEditCallbackProps(props)),
      onDrag: undefined,
      onDragStart: undefined,
      onDragEnd: undefined,
    })

    return new LineLayer(omitBy(isUndefined, deckProps))
  }

  create(props: DeckLayerProps): DeckLayer[] {
    if (props.edit.editing && props.edit.editable && props.edit.rowSelection && props.rows.length) {
      return [this.createEditableLineLayer(props)]
    }

    return [this.createLineLayer(props)]
  }
}
