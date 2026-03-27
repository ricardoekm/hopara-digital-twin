import { VisualizationType } from '../../visualization/domain/spec/Visualization.js'
import {LayerDefaultsService} from './layer-defaults-service.js'

it('overwrite based on visualization type', () => {
  const defaults = LayerDefaultsService.getLayerDefaults(VisualizationType.CHART)
  const lineEncoding = defaults.line.encoding
  expect(lineEncoding.line).toEqual({cap: null, segmentLength: null})
  expect(lineEncoding.size).toEqual({value: 2})

  const circleDefaults = defaults.circle
  expect(circleDefaults.encoding.size).toEqual({value: 10})

  const geoDefaults = LayerDefaultsService.getLayerDefaults(VisualizationType.GEO)
  expect(geoDefaults.circle.encoding.size).toEqual({value: 32})
})
