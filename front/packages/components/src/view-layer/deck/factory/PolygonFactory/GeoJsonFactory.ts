import { GeoJsonLayer } from '@deck.gl/layers'
import { DeckLayer } from '../../DeckLayer'
import { RowTranslator } from '@hopara/dataset'
import { Columns, FieldRowTranslator, Row, Rows } from '@hopara/dataset'
import { ColorEncoding, Encodings } from '@hopara/encoding'
import { StrokableFactory } from '../StrokableFactory'
import { DeckLayerProps } from '../../../DeckLayerFactory'
import { DetailsCallbackFactory } from '../../interaction/DetailsCallbackFactory'
import { decorateAnimation } from '../../animation/AnimationDecorator'
import { GeoJsonNormalizer } from './GeoJsonNormalizer'


export class GeoJsonFactory extends StrokableFactory {
  geoJsonNormalizer = new GeoJsonNormalizer()

  getColorProps(color?: ColorEncoding, rows?: Rows, columns?: Columns, rowTranslator?: RowTranslator): any {
    if (color) {
      const colorAccessor = super.getColorAccessor(
        columns,
        color,
        rows,
        rowTranslator)
      return { filled: true, getFillColor: colorAccessor }
    } else {
      return { filled: false, pickable: false }
    }
  }

  getData(rows: any, encoding: Encodings) {
    const positionField = encoding.position?.coordinates?.field
    if (encoding.polygon && positionField) {
      if (rows) {
        return rows.map((row) => row[positionField])
      }
    }

    return rows
  }

  getLayerProps(props: DeckLayerProps, rows: Rows, rowTranslator?: RowTranslator) {
    return {
      id: props.id,
      layerId: props.layerId,
      pickable: props.edit.pickable,
      updateTriggers: {
        getFillColor: super.getEncodingUpdateTrigger(props.encoding?.color, rows),
        getLineColor: super.getEncodingUpdateTrigger(props.encoding?.strokeColor, rows),
        getLineWidth: super.getEncodingUpdateTrigger(props.encoding?.strokeSize, rows),
        getPosition: super.getPositionUpdateTrigger(props.encoding.position, props.edit.isDragging, rows),
      },
      data: this.getData(rows, props.encoding),
      ...this.getColorProps(
        props.encoding?.color,
        rows,
        props.columns,
        rowTranslator),
      ...super.getStrokeProps(props, rowTranslator),
      ...DetailsCallbackFactory.createCallbacks(props.callbacks, props, rowTranslator),
    }
  }

  getRowTranslator(rows: Rows, encoding: Encodings) {
    const positionField = encoding.position?.coordinates?.field as string
    return new FieldRowTranslator(rows, positionField)
  }

  doCreate(props: DeckLayerProps, rows: Rows): DeckLayer {
    const rowTranslator = this.getRowTranslator(rows, props.encoding)
    const layerProps = this.getLayerProps(props, rows, rowTranslator)
    let deckProps = super.getDeckProps(props, layerProps)
    deckProps = decorateAnimation(props, deckProps)

    return new GeoJsonLayer(deckProps)
  }

  parseContent(row: any, positionField: string) {
    const fieldContent = row[positionField]
    if (typeof fieldContent === 'string') {
      try {
        return JSON.parse(fieldContent)
      } catch {
        // do nothing
      }
    }
    return fieldContent
  }

  getPositionField(props: DeckLayerProps): string {
    return props.encoding.position?.coordinates?.field as string
  }

  create(props: DeckLayerProps): DeckLayer[] {
    const parsedRows = new Rows()
    for (const row of props.rows ?? []) {
      const clonedRow = new Row(row)
      const positionField = this.getPositionField(props)
      clonedRow[positionField] = this.geoJsonNormalizer.normalize(clonedRow[positionField])
      parsedRows.push(clonedRow)
    }
    parsedRows.setEtag(props.rows.getEtag())
    parsedRows.columns = props.rows.columns

    return [this.doCreate(props, parsedRows)]
  }
}
