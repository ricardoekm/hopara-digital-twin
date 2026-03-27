import {PathLayer} from '@deck.gl/layers'
import { PathData } from '../marks/line'
import { FactoryProps, getDeckProps } from './BaseFactory'

export function createPathLayer(id: string, data: PathData[], props: FactoryProps) {
  if (!data) return null

  return new PathLayer<PathData>({
    ...getDeckProps(id, data, props),
    widthScale: 1,
    widthMinPixels: 2,
    widthUnits: 'pixels',
    getPath: (o: any) => o.positions,
    getColor: (o: any) => o.strokeColor,
    getWidth: (o: any) => o.strokeWidth,
  })
}
