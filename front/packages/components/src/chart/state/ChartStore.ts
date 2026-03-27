import { Projector } from '@hopara/projector'
import { AxesDimensions } from '../domain/AxesDimension'

export class ChartStore {
  dimensions?: AxesDimensions
  projector?: Projector

  constructor(store?: Partial<ChartStore>) {
    Object.assign(this, store)
  }

  setDimensions(dimensions: AxesDimensions): ChartStore {
    if (dimensions.x.width !== this.dimensions?.x.width || dimensions.y.height !== this.dimensions?.y.height) {
      return new ChartStore({...this, dimensions})
    }

    return this
  }

  setProjector(projector: Projector): ChartStore {
    return new ChartStore({...this, projector})
  }

  hasAxis() {
    return this.dimensions?.x.height && this.dimensions?.y.width
  }
}
