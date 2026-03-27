import {PolygonLayer} from '@deck.gl/layers'
import {DeckLayer} from '../../DeckLayer'
import {Row, RowTranslator} from '@hopara/dataset'
import {Columns, Rows} from '@hopara/dataset'
import {ColorEncoding} from '@hopara/encoding'
import {StrokableFactory} from '../StrokableFactory'
import { DeckLayerProps } from '../../../DeckLayerFactory'
import { DetailsCallbackFactory } from '../../interaction/DetailsCallbackFactory'
import { EditableGeometryFactory } from '../EditableFactory/EditableGeometryFactory'
import { getSelectedRow } from '../../interaction/RowSelection'
import { isNil } from 'lodash/fp'
import { PolygonAccessorFactory } from './PolygonAccessorFactory'
import { decorateAnimation } from '../../animation/AnimationDecorator'

const editableGeometryFactory = new EditableGeometryFactory()

export class GeometryFactory extends StrokableFactory {
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

  getLayerProps(props: DeckLayerProps, selectedRow?: Row): any {
    return {
      id: props.id,
      layerId: props.layerId,
      pickable: props.edit.pickable,
      updateTriggers: {
        getFillColor: super.getEncodingUpdateTrigger(props.encoding?.color, props.rows),
        getLineColor: super.getEncodingUpdateTrigger(props.encoding?.strokeColor, props.rows),
        getLineWidth: super.getEncodingUpdateTrigger(props.encoding?.strokeSize, props.rows),
        getPolygon: super.getPositionUpdateTrigger(props.encoding.position, props.edit.isDragging, props.rows).concat(!!selectedRow),
      },
      data: selectedRow ? props.rows.filter((row) => !isNil(selectedRow._id) && row._id !== selectedRow._id) : props.rows,
      getPolygon: PolygonAccessorFactory.create(props.encoding.borderRadius?.getRenderValue()),
      ...this.getColorProps(
        props.encoding?.color,
        props.rows,
        props.columns),
      ...super.getStrokeProps(props),
      ...DetailsCallbackFactory.createCallbacks(props.callbacks, props),
    }
  }

  createEditableLayer(props: DeckLayerProps): DeckLayer[] {
    const selectedRow = getSelectedRow(props.rows, props.edit.rowSelection)

    const editablePolygonLayer = editableGeometryFactory.create(props)
    let polygonLayerProps = super.getDeckProps(props, this.getLayerProps(props, selectedRow))
    polygonLayerProps = decorateAnimation(props, polygonLayerProps)
    const polygonLayer = new PolygonLayer(polygonLayerProps)

    if (editablePolygonLayer.length) {
      return [polygonLayer, editablePolygonLayer].flat()
    } else {
      return [polygonLayer]
    }
  }

  create(props: DeckLayerProps): DeckLayer[] {
    if (props.edit.editing) {
      return this.createEditableLayer(props)
    }

    let deckProps = super.getDeckProps(props, this.getLayerProps(props))
    deckProps = decorateAnimation(props, deckProps)

    return [new PolygonLayer(deckProps)]
  }
}
