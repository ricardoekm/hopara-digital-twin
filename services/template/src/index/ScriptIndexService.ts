import { AxiosInstance } from 'axios'
import { DatasetConfig } from './QueryIndexService'
import { ResourceRepository } from '../resource/ResourceRepository'
import { Script } from '../template/Template'
import { isEmpty } from 'lodash'

export class ScriptIndexService {
  constructor(private readonly httpClient: AxiosInstance,
              private readonly datasetConfig: DatasetConfig,
              private readonly resourceRepository: ResourceRepository

  ) {}

  async index(templateId: string, scriptName: string, tenant: string, authorization: string) {
    const script = await this.resourceRepository.getText(templateId, 'data', scriptName)
    if ( !script ) {
        throw new Error(`Script file ${scriptName} not found in template ${templateId}`)
    }

    const headers = { 
      'Authorization': authorization, 
      'Content-Type': 'application/sql',
      tenant 
    }
    const url = new URL(`/script`, this.datasetConfig.url)
    const res = await this.httpClient.request({
      method: 'POST',
      url: url.href,
      data: script.Data,
      headers,
      params: {
        dataSource: 'hopara',
      }
    })
    return res.data
  }

  async indexScripts(scripts:Script | undefined, templateId: string, recreate: boolean | undefined, tenant: string, authorization: string) {
    if ( recreate && !isEmpty(scripts?.drop) ) {
        const promises = []
        for (const scriptName of scripts!.drop) {
            const indexPromise = this.index(templateId, scriptName, tenant, authorization)
            promises.push(indexPromise)
        }
        await Promise.all(promises)
    }

    if (!isEmpty(scripts?.create) ) {
        const promises = []
        for (const scriptName of scripts!.create) {
            const indexPromise = this.index(templateId, scriptName, tenant, authorization)
            promises.push(indexPromise)
        }
        await Promise.all(promises)
    }
}
}
