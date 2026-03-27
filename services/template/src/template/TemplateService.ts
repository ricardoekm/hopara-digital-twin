import {Script, Template} from './Template'
import { ResourceRepository } from '../resource/ResourceRepository'
import { Resource } from '../resource/Resource'
import { StorageRepository } from '../storage/StorageRepository'

export class TemplateService {
  constructor(
    private readonly resourceRepository: ResourceRepository,
    private readonly storage: StorageRepository
  ) {}

  baseFolderOrder = ['geo', 'whiteboard', 'isometric-whiteboard', '3d', 'chart']

  sortListFolders(folders: string[]) {
    const sortedFolders = folders.sort((a, b) => {
      const aIndex = this.baseFolderOrder.indexOf(a)
      const bIndex = this.baseFolderOrder.indexOf(b)
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex
      }
      return a.localeCompare(b)
    })
    return sortedFolders
  }

  async list(): Promise<(string)[]> {
    const folders = await this.storage.listFolders('listed/')
    const sortedFolters = this.sortListFolders(folders)
    return sortedFolters
  }

  async getVisualizations(templateId:string) : Promise<Resource[]> {
    const templateFolder = await this.resourceRepository.getTemplateFolder(templateId)
    const visualizationFiles = await this.storage.listFiles(`${templateFolder}/visualizations`)
    if ( visualizationFiles.length === 0 ) {
      throw new Error('No visualization found for template ' + templateId)
    }

    return visualizationFiles.map((file) => {
      return Resource.fromFile(file)
    })
  }

  async get(templateId: string): Promise<Template | null> {
    const templateFolder = await this.resourceRepository.getTemplateFolder(templateId)
    if ( !templateFolder ) {
      return null
    }

    const template:Template = {id: templateId} as Template

    const queriesPromise = this.storage.listFiles(`${templateFolder}/queries`)
    const scriptsPromise = this.storage.getJSONFile(`${templateFolder}/scripts.json`)
    const imagesPromise = this.storage.listFiles(`${templateFolder}/images`)

    const queryFiles = (await queriesPromise as string[]) ?? []
    const scripts = (await scriptsPromise as Script) ?? {}
    const images = (await imagesPromise as string[]) ?? []

    template.images = images

    const visualizations = await this.getVisualizations(templateId)
    template.visualizations = visualizations.map((visualization) => visualization.name)

    if (queryFiles.length) {
      template.queries = Resource.fromFiles(queryFiles).map((resource) => resource.name)
    }

    template.scripts = scripts
    return template
  }
}
