import { isEmpty } from 'lodash'
import { Layers } from '../layer/Layers'
import { LayerType } from '../layer/LayerType'
import { MapStyle } from '@hopara/encoding'

const arcgisMapStyles = [MapStyle.satellite, MapStyle.navigation]
const googleMapStyles = [MapStyle.googleSatellite]

export const GOOGLE_MAPS_MAX_ZOOM_RANGE = 19

export enum MapStyleSource {
  arcgis = 'arcgis',
  maptiler = 'maptiler',
  google = 'google',
}

export function isArgGisMap(style?: MapStyle): boolean {
  return !!style && arcgisMapStyles.includes(style)
}

export function isGoogleMap(style?: MapStyle): boolean {
  return !!style && googleMapStyles.includes(style)
}

export function getMapStyleSource(style?: MapStyle): MapStyleSource {
  if (isArgGisMap(style)) {
    return MapStyleSource.arcgis
  } else if (isGoogleMap(style)) {
    return MapStyleSource.google
  }
  return MapStyleSource.maptiler
}

export function getMapStyle(layers:Layers, currentZoom?:number, userMapStyle?:MapStyle) : MapStyle {
  if (userMapStyle) {
    return userMapStyle
  }

  const mapLayers = layers.filter((layer) => layer.isType(LayerType.map) &&
                                             layer.isVisible(currentZoom) &&
                                             layer.encoding.map?.value)
  if (!isEmpty(mapLayers)) {
    return mapLayers[0]!.encoding!.map!.value
  }

  return MapStyle.none
}
