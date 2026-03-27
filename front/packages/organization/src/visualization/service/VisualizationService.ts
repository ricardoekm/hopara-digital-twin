import {Authorization} from '@hopara/authorization'
import {httpDelete, httpGet, httpPost, httpPut} from '@hopara/http-client'
import {Config} from '@hopara/config'
import {getRefreshedAuthorization} from '@hopara/auth-front/src/contexts/AuthProvider'

export class VisualizationService {
  async refreshAuthorization(authorization: Authorization) {
    return await getRefreshedAuthorization(authorization)
  }

  async delete(visualizationId: string, authorization: Authorization) {
    const refrehedAuthorization = await this.refreshAuthorization(authorization)
    const res = await httpDelete(Config.getValue('VISUALIZATION_API_ADDRESS'), `/visualization/${visualizationId}`, {}, refrehedAuthorization)
    return res.data
  }

  async list(authorization: Authorization) {
    const refrehedAuthorization = await this.refreshAuthorization(authorization)
    const res = await httpGet(Config.getValue('VISUALIZATION_API_ADDRESS'), `/visualization`, {}, refrehedAuthorization)
    return res.data
  }

  async updateName(visualizationId: string, name: string, authorization: Authorization) {
    const refrehedAuthorization = await this.refreshAuthorization(authorization)
    const res = await httpPut(Config.getValue('VISUALIZATION_API_ADDRESS'), `/visualization/${visualizationId}/name`, {name}, {}, refrehedAuthorization)
    return res.data
  }

  async createFromTemplate(templateId: string, visualizationName: string, authorization: Authorization) {
    const refrehedAuthorization = await this.refreshAuthorization(authorization)
    const res = await httpPost(Config.getValue('BFF_API_ADDRESS'), `/visualization`, {templateId, visualizationName}, {}, refrehedAuthorization)
    return res.data
  }

  async duplicate(visualizationId: string, name: string, authorization: Authorization) {
    const refrehedAuthorization = await this.refreshAuthorization(authorization)
    const res = await httpPost(Config.getValue('VISUALIZATION_API_ADDRESS'),
      `/visualization/${visualizationId}/duplicate`,
      {name},
      {},
      refrehedAuthorization,
    )
    return res.data
  }
}
