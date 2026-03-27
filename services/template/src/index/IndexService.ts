
import { TemplateService } from '../template/TemplateService'
import { QueryIndexService } from './QueryIndexService'
import { ImageIndexService } from './ImageIndexService'
import { ScriptIndexService } from './ScriptIndexService'

export class IndexService {
      constructor(
        private readonly templateService: TemplateService,
        private readonly queryIndexService: QueryIndexService,
        private readonly imageIndexService: ImageIndexService,
        private readonly scriptIndexService: ScriptIndexService
      ) {
      }

      async index(templateId: string, tenant:string, authorization: string, recreate = false) {
        try {
          const template = await this.templateService.get(templateId)
          if ( !template ) {
            throw new Error(`Template with id ${templateId} not found`)
          }

          const indexScriptPromise = this.scriptIndexService.indexScripts(template.scripts, templateId, recreate, tenant, authorization)
          const indexImagePromise = this.imageIndexService.indexImages(template.images, templateId, tenant, authorization)

          await indexScriptPromise

          const indexQueryPromise = this.queryIndexService.indexQueries(template.queries, templateId, tenant, authorization)
          await Promise.all([indexQueryPromise, indexImagePromise])
        } catch (error:any) {
          throw new Error(`Error indexing template ${templateId}: ${error?.message}, ${JSON.stringify(error?.response?.data)}`)
        }
     }
}
