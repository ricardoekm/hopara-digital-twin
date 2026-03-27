import {Logger} from '@hopara/internals'

export class GeoJsonNormalizer {
  parseString(geoJson: any): any {
    if (typeof geoJson === 'string') {
      try {
        Logger.warn('GeoJSON sent as string, for better performance, please send it as object')
        return JSON.parse(geoJson)
      } catch (error) {
        Logger.error('Invalid GeoJSON string: ', error)
        return []
      }
    }

    return geoJson
  }

  parseFeatureCollection(geoJson: any): any {
    if (geoJson.type === 'FeatureCollection') {
      Logger.error('GeoJSON feature collection detected, Hopara only works with one feature per row')
    }

    return geoJson
  }

  normalize(geoJson: any): any {
    geoJson = this.parseString(geoJson)    
    geoJson = this.parseFeatureCollection(geoJson)
    return geoJson
  }
}
