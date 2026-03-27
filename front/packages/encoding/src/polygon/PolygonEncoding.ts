import { BaseEncoding } from '../BaseEncoding'

export class PolygonEncoding extends BaseEncoding<PolygonEncoding> {
  contentType?: 'geometry' | 'geo-json'

  constructor(props?: Partial<PolygonEncoding>) {
    super()
    Object.assign(this, props)
  }

  isGeoJson(): boolean {
    if (this.contentType) {
      return this.contentType === 'geo-json'
    }

    return false
  }

  isRenderable(): boolean {
      return true
  }
}
