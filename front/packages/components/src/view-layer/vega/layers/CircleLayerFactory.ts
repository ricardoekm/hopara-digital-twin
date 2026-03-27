import {ScatterplotLayer} from '@deck.gl/layers'
import { CircleData } from '../marks/symbol'
import { FactoryProps, getDeckProps } from './BaseFactory'
import { DetailsCallbacks } from '../../deck/interaction/DetailsCallbackFactory'

export function createCircleLayer(id: string, data: CircleData[], props: FactoryProps, callbacks: DetailsCallbacks) {
  return new ScatterplotLayer({
    ...getDeckProps(id, data, props),
    stroked: true,
    filled: true,
    pickable: true,
    radiusUnits: 'pixels',
    getFillColor: (o: any) => o.color,
    getLineColor: (o: any) => o.strokeColor,
    getLineWidth: (o: any) => o.strokeWidth,
    getPosition: (o: any) => o.position,
    getRadius: (o: any) => o.size,
    ...callbacks,
  })
}
