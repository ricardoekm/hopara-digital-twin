import {CubeLayer} from '../../deck/cube/cube-layer'
import { DetailsCallbacks } from '../../deck/interaction/DetailsCallbackFactory'
import { FactoryProps, getDeckProps } from './BaseFactory'

export function newVegaCubeLayer(id: string, data: any[], props: FactoryProps, callbacks: DetailsCallbacks) {
  const layerProps = getDeckProps(id, data, props)
  return new CubeLayer({
    ...layerProps,
    pickable: true,
    ...callbacks,
  })
}
