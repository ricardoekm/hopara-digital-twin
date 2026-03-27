import { BaseEncoding } from '../BaseEncoding'
import { MapStyle } from './MapStyle'

export class MapEncoding extends BaseEncoding<MapEncoding> {
  value: MapStyle

  constructor(props?: Partial<MapEncoding>) {
    super()
    Object.assign(this, props)
  }

  isRenderable(): boolean {
    return true
  }
}
