import { PolygonEncoding as PolygonEncodingSpec } from '../spec/PolygonEncoding.js'

export class PolygonEncodingImpl {
  contentType?: 'geometry' | 'geo-json'

  constructor(props: PolygonEncodingSpec) {
    Object.assign(this, props)
  }
}
