import { Layers } from '../layer/Layers'
import { MapStyle } from '@hopara/encoding'
import { getMapStyle, getMapStyleSource, isArgGisMap, isGoogleMap } from '../map/MapStyleFactory'
import { Config } from '@hopara/config'

const mapStyleNameToId = {
  [MapStyle.building]: 'winter',
  [MapStyle.dark]: '6bafab84-bb35-4ff5-b048-d419f7d0da53',
  [MapStyle.lightStreet]: '659eb88b-0a25-45ca-a129-3682b21b1b80',
  [MapStyle.light]: '419395b0-c660-4d87-b01d-e0d48df9c702',
  [MapStyle.navigation]: 'navigation',
  [MapStyle.satellite]: 'imagery',
  [MapStyle.googleSatellite]: 'hybrid',
} as Record<MapStyle, string>

function getViewMapStyle(style?: MapStyle): string {
  const styleId = (style && mapStyleNameToId[style]) ?? mapStyleNameToId['map-style-light']
  if (isArgGisMap(style)) {
    return `https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/styles/arcgis/${styleId}?token=${Config.getValue('ARCGIS_API_TOKEN')}`
  } else if (isGoogleMap(style)) {
    return styleId
  }
  return `https://api.maptiler.com/maps/${styleId}/style.json?key=${Config.getValue('MAPTILER_API_TOKEN')}`
}

export function createMapViewLayer(layers:Layers, currentZoom:number, userMapStyle?:MapStyle) {
  const mapStyle = getMapStyle(layers, currentZoom, userMapStyle)
  if (mapStyle && mapStyle !== MapStyle.none) {
    return {
      style: getViewMapStyle(mapStyle),
      source: getMapStyleSource(mapStyle),
    }
  }
}
