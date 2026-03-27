import {TextLayer} from '@deck.gl/layers'
import {TextData} from '../marks/text'
import {FactoryProps, getDeckProps} from './BaseFactory'
import { DetailsCallbacks } from '../../deck/interaction/DetailsCallbackFactory'

const getCharacterSet = () => {
  const charNumbers = [...Array(256).keys(), 8722]
  return charNumbers.map((charCode) => String.fromCharCode(charCode))
}

const characterSet = getCharacterSet()
const fontSettings = {sdf: false, fontSize: 128, buffer: 3}
const _subLayerProps = { characters: { alphaCutoff: 0.1 } }

export function createTextLayer(id: string, data: TextData[], props: FactoryProps, callbacks: DetailsCallbacks) {
  return new TextLayer({
    ...getDeckProps(id, data, props),
    targetView: props.targetView,
    characterSet,
    sizeUnits: 'pixels',
    pickable: true,
    fontFamily: 'Inter',
    fontSettings,
    getColor: ((o: any) => o.color),
    getTextAnchor: (o: any) => o.textAnchor,
    getSize: (o: any) => o.size,
    getAngle: (o: any) => o.angle,
    _subLayerProps,
    ...callbacks,
  })
}

