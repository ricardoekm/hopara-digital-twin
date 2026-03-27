import { Authorization } from '@hopara/authorization'
import { Language } from '@hopara/browser'
import { Config } from '@hopara/config'
import { httpGet } from '@hopara/http-client'
import { Coordinates } from '@hopara/spatial'

export interface PlaceSuggenstion {
  id: string
  address: string
}

export interface PlaceDetail {
  id: string
  address: string
  latitude: number
  longitude: number
  bounds: [[number, number], [number, number]]
}

export class PlaceSearchRepository {
  static async searchPlaces(input: string, coordinates: Coordinates, language: Language, authorization: Authorization) {
    try {
      return httpGet(Config.getValue('BFF_API_ADDRESS'), '/places', {
        query: input,
        lang: language,
        location: JSON.stringify(coordinates.to2DArray()),
      }, authorization).then((res) => res.data?.suggestions ?? [])
    } catch {
      return []
    }
  }

  static async getPlaceDetails(placeId: string, language: Language, authorization: Authorization): Promise<PlaceDetail | null> {
    try {
      return httpGet(Config.getValue('BFF_API_ADDRESS'), `/place/${placeId}`, {lang: language}, authorization)
        .then((res) => res.data)
    } catch {
      return null
    }
  }
}
