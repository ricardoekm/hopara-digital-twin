import {LineLayer} from '@deck.gl/layers'
import { LineData } from '../marks/line'
import { FactoryProps, getDeckProps } from './BaseFactory'

export function createLineLayer(id: string, data: LineData[], props: FactoryProps) {
  return new LineLayer({
    targetView: props.targetView,
    ...getDeckProps(id, data, props),
    widthUnits: 'pixels',
    getColor: (o: any) => o.color,
    getWidth: (o: any) => o.strokeWidth,
  })
}
