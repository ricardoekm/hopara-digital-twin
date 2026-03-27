import {Config} from '@hopara/config'
import {httpGet} from '@hopara/http-client'
import {Authorization} from '@hopara/authorization'
import {i18n} from '@hopara/i18n'

export class IconRepository {
  static async list(query: string, authorization: Authorization) {
    try {
      return httpGet(Config.getValue('RESOURCE_API_ADDRESS'), `/tenant/${authorization.tenant}/icon`, {query}, authorization)
    } catch (err: any) {
      throw new Error(err?.message ?? i18n('UNKNOWN_ERROR'))
    }
  }
}
