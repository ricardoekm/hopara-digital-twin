import {Client as MapsClient} from '@googlemaps/google-maps-services-js'

export class PlaceRepository {
  constructor(private googleMapsClient: MapsClient) {}

  async getSuggestions(query: string, location?: [number, number], language?: string): Promise<any> {
    return this.googleMapsClient
      .placeAutocomplete({params: {
        input: query,
        language,
        location,
        radius: location ? 100000 : undefined,
      }} as any)
      .then((r: any) => {
        return r.data.predictions
      })
  }

  async getPlace(id: string, language?: string): Promise<any> {
    return this.googleMapsClient
      .placeDetails({params: {place_id: id, language}} as any)
      .then((r: any) => {
        return r.data
      })
  }
}
