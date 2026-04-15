import { AxiosInstance } from 'axios'
import { ResourceRepository, BinaryResourceContent } from '../resource/ResourceRepository'
import { Resource } from '../resource/Resource'
import { isEmpty } from 'lodash'

export type ResourceConfig = {
  url: string
}

export type ImageIndexConfig = {
  batchSize: number
}

export class ImageIndexService {
  constructor(private readonly httpClient: AxiosInstance,
              private readonly resourceConfig: ResourceConfig,
              private readonly resourceRepository: ResourceRepository,
              private readonly imageIndexConfig: ImageIndexConfig
  ) {}

  async index(templateId:string, imageFileName: string, tenant: string, authorization: string) {
    const image = await this.resourceRepository.getBinary(templateId, 'images', imageFileName) as BinaryResourceContent
    
    const formData = new FormData()

    const file = new File([image.Data as any], imageFileName, { type: 'image/png' })
    formData.append('file', file)

    const headers = { Authorization: authorization, tenant }
    const imageName = Resource.fromFile(imageFileName).name
    const url = new URL(`${this.resourceConfig.url}/tenant/${tenant}/image-library/hopara/image/${imageName}`, 
                        this.resourceConfig.url)

    await this.httpClient.put(url.href, formData, { headers, params: { invalidate: false } })
  }

  async indexImages(images:string[], templateId: string, tenant: string, authorization: string) {
    if (!isEmpty(images)) {
      const promises = []
      const imagesBatch = images.slice(0, this.imageIndexConfig.batchSize)
      for (const imageName of imagesBatch) {
        const promise = this.index(templateId, imageName, tenant, authorization)
        promises.push(promise)
      }
      await Promise.all(promises)
      await this.indexImages(images.slice(this.imageIndexConfig.batchSize), templateId, tenant, authorization)
    }
  }
}
