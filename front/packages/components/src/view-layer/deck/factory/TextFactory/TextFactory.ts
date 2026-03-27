import {PositionAccessorFactory, TextEncoding} from '@hopara/encoding'
import {BaseFactory} from '../BaseFactory'
import {isUndefined, omitBy} from 'lodash/fp'
import { decorateOffset } from '../../offset/OffsetDecorator'
import { DeckLayerProps } from '../../../DeckLayerFactory'
import { CallbacksFactory } from '../../interaction/CallbacksFactory'
import { SizeUnits } from '@hopara/encoding/src/size/SizeEncoding'
import { IndexRowTranslator, Rows } from '@hopara/dataset'
import {setFontAtlasCacheLimit} from '@deck.gl/layers/dist/es5/text-layer/font-atlas-manager'
import FontAtlasManager from '@deck.gl/layers/dist/es5/text-layer/font-atlas-manager'

import { TextLayer } from 'deck.gl'
import { getTextAccessor } from './TextAccessor'

setFontAtlasCacheLimit(12)
const fontAtlasManager = new FontAtlasManager({})

const getSpecialChars = () => {
  // adds unmapped chars 0 - 255 (https://www.ascii-code.com/) + minus sign (8722) + ellipsis (8230)
  const charNumbers = [...Array(256).keys(), 8722, 8230]
  return charNumbers.map((charCode) => String.fromCharCode(charCode))
}

const characterSet = getSpecialChars()

export class TextFactory extends BaseFactory<DeckLayerProps> {
  hasTextEncoding(textEncoding?: TextEncoding): textEncoding is TextEncoding {
    return !isUndefined(textEncoding)
  }

  getTextEncodingUpdateTrigger(encoding: TextEncoding | undefined, rows: Rows | undefined, isDragging: boolean) {
    const triggers = BaseFactory.createEncodingTriggers(encoding, rows)
    if (isDragging) {
      triggers.push(() => ({}))
    }
    return triggers
  }

  updateFontAtlasManager(fontProps) {
    if (
      fontProps.fontSize === fontAtlasManager.props.fontSize &&
      fontProps.fontFamily === fontAtlasManager.props.fontFamily &&
      fontProps.fontWeight === fontAtlasManager.props.fontWeight
    ) return

    fontAtlasManager.setProps(fontProps)
  }

  create(props:DeckLayerProps) : any {
    const textEncoding = props.encoding.text as TextEncoding
    const multiplier = props.encoding.size?.multiplier ?? 1
    const fontFamily = 'Inter'
    const fontSettings = {fontSize: 50}
    const fontWeight = textEncoding.getWeight() || 'normal'
    
    this.updateFontAtlasManager({
      ...fontSettings,
      characterSet,
      fontFamily,
      fontWeight,
    })

    const sizeAccessor = super.getSizeAccessor(props.rows, props.encoding?.size)
    let deckProps = super.getDeckProps(props, {
      id: `${props.id}-#${props.encoding.text!.field}`,
      pickable: props.edit.pickable,
      data: props.rows,
      getPosition: PositionAccessorFactory.create(props.encoding.position?.anchor),
      getText: getTextAccessor(textEncoding, sizeAccessor, props.encoding?.getUnits(), fontAtlasManager, props.viewport!, props.viewState),
      fontWeight,
      getTextAnchor: textEncoding.getAnchor(),
      getAngle: textEncoding.getAngle(),
      sizeUnits: props.encoding?.getUnits() || SizeUnits.PIXELS,
      sizeMaxPixels: super.getMaxPixels(props.viewport, props.encoding.size, props.encoding.config, multiplier),
      getSize: sizeAccessor,
      getColor: super.getColorAccessor(props.columns, props.encoding?.color, props.rows),
      updateTriggers: {
        getColor: super.getEncodingUpdateTrigger(props.encoding.color, props.rows),
        getSize: super.getEncodingUpdateTrigger(props.encoding.size, props.rows),
        getPosition: super.getPositionUpdateTrigger(props.encoding.position, props.edit.isDragging, props.rows),
        getText: this.getTextEncodingUpdateTrigger(props.encoding.text, props.rows, props.edit.isDragging),
        getWeight: super.getEncodingUpdateTrigger(props.encoding.text, props.rows),
        getTextAnchor: super.getEncodingUpdateTrigger(props.encoding.text, props.rows),
      },
      characterSet,
      fontFamily,
      fontSettings,
      ...CallbacksFactory.create(this.getEditCallbackProps(props), new IndexRowTranslator(props.rows)),
    }) 

    deckProps = decorateOffset(props, deckProps)

    return [new TextLayer(omitBy(isUndefined, deckProps))]
  }
}
