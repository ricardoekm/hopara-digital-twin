import { UserInfo } from '@hopara/http-server'
import {TemplateVisualizationService} from './template-visualization-service.js'

describe('TemplateVisualizationService', () => {
  const anyViz = { id: 'any-id' }

  const templateRepo = {
    getVisualizations: jest.fn().mockResolvedValue([anyViz]),
  }

  const visService = {
    upsert: jest.fn().mockResolvedValue(undefined),
  }

  const service = new TemplateVisualizationService(
    visService as any,
    templateRepo as any,
  )

  const anyUserInfo = {email: 'any-email', authorization: 'any-token', tenant: 'any-tenant'} as UserInfo

  describe('create', () => {
    it('should get a template, validate and upsert it', async () => {
      await service.create('any-template', {}, anyUserInfo)
      expect(templateRepo.getVisualizations).toHaveBeenCalledWith('any-template')
      expect(visService.upsert).toHaveBeenCalledWith(anyViz, true, anyUserInfo)
    })
  })
})
