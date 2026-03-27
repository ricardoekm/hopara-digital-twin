import { ResourceRepository } from '../resource/ResourceRepository'
import {TemplateService} from './TemplateService'

describe('get', () => {
  it('should create template from S3 files', async () => {
    const listFilesStub = jest.fn().mockReturnValue(['visualizationFiles1.json', 'visualizationFiles2.json'])
                                    .mockReturnValueOnce(new Promise((resolve) => resolve(['queries1.toml', 'queries2.toml'])))
    const getJSONFileStub = jest.fn().mockReturnValue(new Promise((resolve) => resolve({create: 'script1.sql'})))
    const pathExistsStub = jest.fn().mockReturnValue(new Promise((resolve) => resolve(true)))

    const storageRepository = {listFiles: listFilesStub, getJSONFile: getJSONFileStub, pathExists: pathExistsStub} as any

    const resourceRepository = new ResourceRepository({} as any, storageRepository)
    const service = new TemplateService(resourceRepository, storageRepository)
    const template = await service.get('any_template')
    expect(template).toEqual({
      'id': 'any_template',
      'visualizations': ['visualizationFiles1', 'visualizationFiles2'],
      'images': ['visualizationFiles1.json', 'visualizationFiles2.json'],
      'queries': ['queries1', 'queries2'],
      'scripts': { create: 'script1.sql' },
    })
  })
})

describe('folder list', () => {
  it('should sort folder list', async () => {
    const resourceRepository = new ResourceRepository({} as any, {} as any)
    const service = new TemplateService(resourceRepository, {} as any)
    const sorted = await service.sortListFolders(['3d', 'geo', 'whiteboard', 'chart', 'other', 'lab'])
    expect(sorted).toEqual(['geo', 'whiteboard', '3d', 'chart', 'lab', 'other'])
  })
})
