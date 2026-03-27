import {Columns, Rows, RowTranslator} from '@hopara/dataset'
import {ColorEncoding, SizeEncoding} from '@hopara/encoding'
import {BaseFactory} from './BaseFactory'
import {DeckLayerProps} from '../../DeckLayerFactory'

export abstract class StrokableFactory extends BaseFactory<DeckLayerProps> {
  private getColorStrokeProps(color?:ColorEncoding, rows?: Rows, columns?: Columns, rowTranslator?: RowTranslator): any {
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

  private hasStroke(size?: SizeEncoding): boolean {
    return !!(size && (size.field || size.getRenderValue() > 0))
  }

  private getStrokeSizeProps(
    props: DeckLayerProps,
    rowTranslator?: RowTranslator,
  ): any {
    if (!props.encoding.strokeSize) {
      return {}
    }

    return {
      getLineWidth: super.getSizeAccessor(
        props.rows,
        props.encoding.strokeSize,
        rowTranslator,
      ),
      lineWidthUnits: props.encoding.getUnits(),
      lineWidthMaxPixels: super.getMaxPixels(props.viewport, props.encoding.strokeSize, props.encoding.config),
    }
  }

  getStrokeProps(
    props: DeckLayerProps,
    rowTranslator?: RowTranslator,
  ) {
    const sizeProps = this.getStrokeSizeProps(
      props,
      rowTranslator,
    )

    const colorProps = this.getColorStrokeProps(
      props.encoding.strokeColor,
      props.rows,
      props.columns,
    )

    return {
      ...sizeProps,
      ...colorProps,
      stroked: this.hasStroke(props.encoding.strokeSize),
    }
  }
}
