import {Columns, Rows, Row, Column} from '@hopara/dataset'
import {ColorFieldAccessor} from './ColorFieldAccessor'
import {ColorLiteralAccessor} from './ColorLiteralAccessor'
import {ColorEncoding} from '../ColorEncoding'
import {RowTranslator} from '@hopara/dataset'
import {ColorConditionalAccessor} from './ColorConditionalAccessor'
import {i18n} from '@hopara/i18n'

export interface Accessor {
  getColor(rows: Rows, row:any, column:Column)
}

export function getColorAccessorInstance(colorEncoding:ColorEncoding | undefined) {
  if (!(colorEncoding instanceof ColorEncoding)) {
    throw new Error(i18n('COLOR_ENCODING_IS_NOT_DEFINED'))
  }
  if (colorEncoding.hasCondition()) {
    return new ColorConditionalAccessor(colorEncoding)
  }
  if (colorEncoding.getField()) {
    return new ColorFieldAccessor(colorEncoding)
  }
  return new ColorLiteralAccessor(colorEncoding)
}

export function getColumn(colorEncoding?:ColorEncoding, columns?:Columns): Column | undefined {
  if (!colorEncoding?.getField()) return
  const column = columns?.get(colorEncoding.getField())
  if (!column) return
  return column
}

export function getColorAccessor(
  colorEncoding:ColorEncoding | undefined,
  rows: Rows,
  columns:Columns,
  rowTranslator?: RowTranslator) {
  const accessor = getColorAccessorInstance(colorEncoding)
  if (accessor instanceof ColorLiteralAccessor) {
    // Deck.gl optimization in case we don't need callbacks
    // https://deck.gl/docs/developer-guide/performance#favor-constants-over-callback-functions
    return accessor.getColor()
  }

  return (row:Row) => {
    if (rowTranslator) row = rowTranslator.translate(row)
      return accessor.getColor(rows, row, getColumn(colorEncoding, columns))
  }
}
