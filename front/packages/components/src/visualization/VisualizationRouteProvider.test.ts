import { Location } from 'react-router-dom'
import { getRouteParams } from './VisualizationRouteProvider'
import { Coordinates } from '@hopara/spatial'

test('parse empty route params', () => {
  const location = {
    search: '',
  } as Location

  expect(getRouteParams(location)).toEqual({
    bearing: undefined,
    coordinates: undefined,
    fallbackvisualizationId: undefined,
    floor: undefined,
    initialRow: undefined,
    selectedFilters: [],
    visualizationId: undefined,
    zoom: undefined,
  })
})

test('parse basic params', () => {
  const location = {
    search: '?x=1&y=2&z=3',
  } as Location

  expect(getRouteParams(location)).toEqual({
    coordinates: new Coordinates({ x: 1, y: 2, z: 3 }),
    selectedFilters: [],
  })
})

test('parse with non numeric values', () => {
  const location = {
    search: `?x=a&y=b&z=c&bearing=d&zoom=e`,
  } as Location

  expect(getRouteParams(location)).toEqual({
    coordinates: new Coordinates({ x: 0, y: 0, z: 0 }),
    selectedFilters: [],
  })
})
