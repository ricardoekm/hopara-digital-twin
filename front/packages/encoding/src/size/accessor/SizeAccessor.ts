import {Row, Rows} from '@hopara/dataset'
import { RowTranslator } from '@hopara/dataset'
import { SizeLiteralAccessor } from './SizeLiteralAccessor'
import { SizeEncoding } from '../SizeEncoding'

export enum DeckSizeType {
  RADIUS,
  DIAMETER
}

function getTypeMultiplier(deckSizeType?: DeckSizeType) : number {
  if (deckSizeType == DeckSizeType.RADIUS) {
    return 0.5
  }

  return 1
}

const DEFAULT_SIZE = 10
 
export function getSizeAccessor(
  rows: Rows,
  encoding?:SizeEncoding,
  rowTranslator?: RowTranslator,
  deckSizeType?: DeckSizeType,
) {
  if (!encoding) {
    return DEFAULT_SIZE
  }

  // we assume the multiplier is deck.gl responsibility (similar to the radius scale field)
  const multiplier = getTypeMultiplier(deckSizeType) * encoding.getMultiplier()
  if (!encoding.isFieldBased()) {
     // Deck.gl optimization in case we don't need callbacks
    // https://deck.gl/docs/developer-guide/performance#favor-constants-over-callback-functions
    return new SizeLiteralAccessor(encoding).getSize() * multiplier
  }

  const sizeField = encoding.getField()
  const column = rows.columns?.get(sizeField)

  return (row: Row) => {
    if (rowTranslator) row = rowTranslator.translate(row)
    return encoding.getSize(row, rows, column) * multiplier
  }
}
