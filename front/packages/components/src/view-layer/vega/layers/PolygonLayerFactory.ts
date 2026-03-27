import {PolygonLayer} from '@deck.gl/layers'
import { PolygonData } from '../marks/area'
import { FactoryProps, getDeckProps } from './BaseFactory'
import { DetailsCallbacks } from '../../deck/interaction/DetailsCallbackFactory'

export function createPolygonLayer(id: string, data: PolygonData[], props: FactoryProps, callbacks: DetailsCallbacks) {
  if (!data) return null
  
  const newlayer = new PolygonLayer<PolygonData>({
    ...getDeckProps(id, data, props),
    tagetView: props.targetView,
    getPolygon: (o: any) => o.positions,
    getFillColor: (o: any) => o.fillColor,
    getLineColor: (o: any) => o.strokeColor,
    filled: true,
    stroked: true,
    pickable: true,
    getLineWidth: (o: any) => o.strokeWidth,
    ...callbacks,
  })
  return newlayer
}
