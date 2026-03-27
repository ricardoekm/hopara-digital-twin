import { AxiosInstance } from 'axios'
import { Authorization } from '../authorization'

export type TemplateConfig = {
  url: string
}

export class TemplateRepository {
    constructor(
        private readonly httpClient: AxiosInstance,
        private readonly templateConfig: TemplateConfig
    ) {
    }

    async index(templateId:string, recreate: boolean, authorization: Authorization): Promise<any> {
        const headers = {
            'Authorization': authorization.token,
            'Tenant': authorization.tenant,
        }

        const response = await this.httpClient.put(
            `${this.templateConfig.url}/template/${templateId}/index?recreate=${recreate}`,
            {},
            {
               headers,
               timeout: 480 * 1000
            }
        )
        return response?.data
    }
}
