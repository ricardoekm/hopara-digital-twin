import {VisualizationService} from './visualization-service.js'
import {VisualizationType} from '../domain/spec/Visualization.js'
import {UserInfo} from '@hopara/http-server'
import {VisualizationFactory} from '../domain/factory/visualization-factory.js'
import { LayerType } from '../../layer/domain/spec/LayerType.js'

describe('VisualizationService', () => {
  const rawVisualization = {
    type: VisualizationType.GEO,
    layers: [{
      type: 'circle',
      name: 'any-layer-name',
    }],
  }

  const visualizationRepo = {
    get: jest.fn().mockResolvedValue(VisualizationFactory.fromSpec(rawVisualization as any)),
  }
  const logger = {
    debug: jest.fn(),
  }
  const datasetRepo = {}
  const vizValidator = {}
  const notificationService = {}

  const visualizationService = new VisualizationService(
    visualizationRepo as any,
    logger as any,
    vizValidator as any,
    datasetRepo as any,
    notificationService as any
  )

  const anyUserInfo = {email: 'any-email', authorization: 'any-token', tenant: 'any-tenant'} as UserInfo

  describe('get', () => {
    it('should return enriched visualization', async () => {
      const visualization = await visualizationService.get('visualizationId', undefined, anyUserInfo)
      expect(visualization).toMatchObject({
        'id': expect.stringMatching(/^[0-9a-f-]{36}$/),
        'encodingScope': 'QUERY',
        'filters': [],
        'zoomBehavior': {
          'x': 'SCALE',
          'y': 'SCALE',
        },
        'zoomRange': {
          'max': {
            'value': 24,
          },
          'min': {
            'value': 0,
          },
        },
        'layers': [
          expect.objectContaining({
            type: LayerType.circle,
          }),
        ],
      })
    })
  })
})
