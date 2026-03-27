import {Config} from '@hopara/config'
import {httpDelete, httpGet, httpPutFormData} from '@hopara/http-client'
import {Authorization} from '@hopara/authorization'
import {i18n} from '@hopara/i18n'
import {IconLibrary, ListIconResponse} from '../domain/Icon'
import { getRefreshedAuthorization } from '@hopara/auth-front/src/contexts/AuthProvider'

export class IconService {
  async refreshAuthorization(authorization: Authorization) {
    return await getRefreshedAuthorization(authorization)
  }

  async listLibraries(authorization: Authorization): Promise<IconLibrary[]> {
    try {
      const refreshedAuthorization = await this.refreshAuthorization(authorization)
      const res = await httpGet(Config.getValue('BFF_API_ADDRESS'), `/icon-library`, {}, refreshedAuthorization)
      return res.data
    } catch (err: any) {
      throw new Error(err?.message ?? i18n('UNKNOWN_ERROR'))
    }
  }

  async listLibraryIcons(
    libraryName: string, authorization: Authorization,
    limit: number, pageToken?: string, search?: string,
  ): Promise<ListIconResponse> {
    try {
      const refreshedAuthorization = await this.refreshAuthorization(authorization)
      const res = await httpGet(Config.getValue('RESOURCE_API_ADDRESS'), `/tenant/${refreshedAuthorization.tenant}/icon-library/${libraryName}/icon`, {
        limit,
        page_token: pageToken,
        query: search,
      },
      refreshedAuthorization)
      return {
        icons: await res.data,
        nextPageToken: res.headers ? res.headers['next-page-token'] : undefined,
      }
    } catch (err: any) {
      throw err.message ? err : new Error(i18n('UNKNOWN_ERROR'))
    }
  }

  getIconUrl(libraryName: string, iconName: string, authorization: Authorization): string {
    return `${Config.getValue('RESOURCE_API_ADDRESS')}/tenant/${authorization.tenant}/icon-library/${libraryName}/icon/${iconName}`
  }

  async upsert(libraryName: string, icon: string, formData: FormData | undefined, authorization: Authorization) {
    try {
      const refreshedAuthorization = await this.refreshAuthorization(authorization)
      await httpPutFormData(Config.getValue('RESOURCE_API_ADDRESS'), `/tenant/${refreshedAuthorization.tenant}/icon-library/${libraryName}/icon${icon ? `/${icon}` : ''}`, formData, refreshedAuthorization)
    } catch (err: any) {
      throw new Error(err?.message ?? i18n('UNKNOWN_ERROR'))
    }
  }

  async delete(libraryName: string, icon: string, authorization: Authorization) {
    try {
      const refreshedAuthorization = await this.refreshAuthorization(authorization)
      return httpDelete(Config.getValue('RESOURCE_API_ADDRESS'), `/tenant/${authorization.tenant}/icon-library/${libraryName}/icon/${icon}`, {}, refreshedAuthorization)
    } catch (err: any) {
      throw new Error(err?.message ?? i18n('UNKNOWN_ERROR'))
    }
  }

  async getLibrary(libraryName: string, authorization: Authorization) {
    try {
      const refreshedAuthorization = await this.refreshAuthorization(authorization)
      const res = await httpGet(Config.getValue('RESOURCE_API_ADDRESS'), `/tenant/${authorization.tenant}/icon-library/${libraryName}`, {}, refreshedAuthorization)
      return res.data
    } catch (err: any) {
      throw err.message ? err : new Error(i18n('UNKNOWN_ERROR'))
    }
  }
}
