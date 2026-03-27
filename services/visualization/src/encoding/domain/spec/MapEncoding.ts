export enum MapStyle {
  none = 'none',
  building = 'building',
  dark = 'dark',
  light = 'light',
  lightStreet = 'light-street',
  navigation = 'navigation',
  satellite = 'satellite',
  googleMapsSatellite = 'google-maps-satellite',
}

export interface MapEncoding {
   /**
   * @description The map style
   * @default light-street
   */
  value?: MapStyle
}
