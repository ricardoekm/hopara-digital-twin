import { ResourceRepository } from './ResourceRepository'
import { Authorization } from '../authorization'

export class ResourceService {
  constructor(
    private readonly resourceRepository: ResourceRepository,
  ) {
  }

  async listIconLibraries(authorization: Authorization): Promise<unknown[]> {
    const libraries = await this.resourceRepository.listIconLibraries(authorization)

    return Promise.all(libraries.map(async (library: any) => {
      const icons = await this.resourceRepository.listIcons(library.name, authorization)
      return {
        name: library.name,
        editable: library.editable,
        icons,
      }
    }))
  }
}
