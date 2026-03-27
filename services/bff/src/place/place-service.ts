import { PlaceRepository } from './place-repository'

export interface PlaceSuggestionResponse {
  suggestions: PlacePrediction[]
}

export type Bounds = [[number, number], [number, number]]

export interface PlaceDetail {
  name: string
  id: string
  address: string
  latitude: number,
  longitude: number
  bounds: Bounds
}

export interface PlacePrediction {
  id: string
  address: string
  mainText: string
  secondaryText: string
}

export class PlaceService {
  constructor(private placeRepository: PlaceRepository) {}
    private predictionsToLocations(predictions: any[]): PlacePrediction[] {
      return predictions.map((p: any) => {
        return {
          id: p.place_id,
          mainText: p.structured_formatting.main_text,
          secondaryText: p.structured_formatting.secondary_text,
          address: p.description,
        }
      })
    }

    async getSuggestions(query: string, location?: [number, number], lang?: string): Promise<PlaceSuggestionResponse> {
      const result = await this.placeRepository.getSuggestions(query, location, lang)
      return {suggestions: this.predictionsToLocations(result)}
    }

    private placeToPlaceDetail(place: any): PlaceDetail {
      return {
        id: place.place_id,
        name: place.name,
        address: place.formatted_address,
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        bounds: [
          [place.geometry.viewport.southwest.lng, place.geometry.viewport.southwest.lat],
          [place.geometry.viewport.northeast.lng, place.geometry.viewport.northeast.lat],
        ],
      }
    }

    async getPlace(id: string, lang?: string): Promise<PlaceDetail> {
      const {result} = await this.placeRepository.getPlace(id, lang)
      return this.placeToPlaceDetail(result)
    }
  }
