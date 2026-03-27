import { GeoJsonNormalizer } from './GeoJsonNormalizer'

test('Convert a string to object', () => {
  const geoJson = '{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[0,0],[1,1],[1,0],[0,0]]]},"properties":{}}'
  const geoJsonNormalizer = new GeoJsonNormalizer()
  
  const normalizedGeoJson = geoJsonNormalizer.normalize(geoJson)
  expect(normalizedGeoJson).toEqual({
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [[[0, 0], [1, 1], [1, 0], [0, 0]]],
    },
    properties: {},
  })
})
