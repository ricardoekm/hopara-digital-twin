import {LayerTemplateService} from './layer-template-service.js'

describe('LayerTemplateService', () => {
  describe('list', () => {
    it('should list templates', async () => {
      const anyTemplate = {
        id: 'any-id',
        name: 'any-name',
        image: 'any-image',
        form: [{path: 'any-path'}],
        data: 'any-data',
      }
      const repo = {
        list: jest.fn().mockResolvedValue([anyTemplate]),
      } as any
      const service = new LayerTemplateService(repo)
      const templates = await service.list()
      expect(templates).toEqual([{
        id: 'any-id',
        name: 'any-name',
        image: 'any-image',
        form: [{path: 'any-path'}],
        data: 'any-data',
      }])
    })
  })
})
