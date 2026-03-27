import ArcLayer from '../../deck/arc/arc-layer'
import {FactoryProps, getDeckProps} from './BaseFactory'
import {Arc} from '../marks/interfaces'
import { DetailsCallbacks } from '../../deck/interaction/DetailsCallbackFactory'

export function createArcLayer(id: string, data: Arc[], props:FactoryProps, callbacks: DetailsCallbacks) {
  return new ArcLayer({
    ...getDeckProps(id, data, props),
    getFillColor: (d) => d.color,
    getPosition: (d) => d.position,
    getInnerRadius: (d) => d.innerRadius,
    getOuterRadius: (d) => d.outerRadius,
    getStartAngle: (d) => d.startAngle,
    getEndAngle: (d) => d.endAngle,
    pickable: true,
    ...callbacks,
  })
}
