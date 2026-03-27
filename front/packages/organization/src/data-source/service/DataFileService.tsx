import {httpDelete, httpGet, httpPutFormData} from '@hopara/http-client'
import {Config} from '@hopara/config'
import {Authorization} from '@hopara/authorization'
import {i18n} from '@hopara/i18n'
import {DataFile} from '../DataFile'
import { getRefreshedAuthorization } from '@hopara/auth-front/src/contexts/AuthProvider'

export class DataFileService {
  async refreshAuthorization(authorization: Authorization) {
    return await getRefreshedAuthorization(authorization)
  }

  async list(dataSourceName: string | undefined, authorization: Authorization): Promise<DataFile[]> {
    const refreshedAuthorization = await this.refreshAuthorization(authorization)
    try {
      const res = await httpGet(
        Config.getValue('DATASET_API_ADDRESS'),
        `/data-source/${dataSourceName}/data-file`,
        { dataSource: dataSourceName },
        refreshedAuthorization,
        { withCredentials: true },
      )
      return res.data.map((file: any) => new DataFile({
        name: file.name,
        dataSource: dataSourceName,
      }))
    } catch (err: any) {
      throw new Error(err?.message ?? i18n('UNKNOWN_ERROR'))
    }
  }

  async upsert(name: string, dataSourceName: string, formData: FormData | undefined, authorization: Authorization) {
    const refreshedAuthorization = await this.refreshAuthorization(authorization)
    try {
      const res = await httpPutFormData(Config.getValue('DATASET_API_ADDRESS'),
        `/data-source/${dataSourceName}/data-file/${name}`,
        formData,
        refreshedAuthorization,
        undefined,
        { withCredentials: true },
      )
      return res.data
    } catch (err: any) {
      throw new Error(err?.message ?? i18n('UNKNOWN_ERROR'))
    }
  }

  async delete(fileName: string, dataSource: string, authorization: Authorization) {
    const refreshedAuthorization = await this.refreshAuthorization(authorization)
    return httpDelete(
      Config.getValue('DATASET_API_ADDRESS'),
      `/data-source/${dataSource}/data-file/${fileName}`,
      { dataSource },
      refreshedAuthorization,
      { withCredentials: true },
    )
  }

  async download(file: DataFile, authorization: Authorization) {
    const refreshedAuthorization = await this.refreshAuthorization(authorization)
    const res = await httpGet(
      Config.getValue('DATASET_API_ADDRESS'),
      `/data-source/${file.dataSource}/data-file/${file.name}/content`,
      { dataSource: file.dataSource },
      refreshedAuthorization,
      {
        withCredentials: true,
        parseResponse: false,
      },
    )
    const url = window.URL.createObjectURL(
      new Blob([res.data], {type: res.headers['content-type']}),
    )
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', file.name)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
