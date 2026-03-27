import {httpGet} from '@hopara/http-client'
import {Config} from '@hopara/config'
import {Authorization} from '@hopara/authorization'
import {i18n} from '@hopara/i18n'
import { getRefreshedAuthorization } from '@hopara/auth-front/src/contexts/AuthProvider'
import { isNil } from 'lodash'
import { Tenant, TenantCreationStatus } from './Tenant'

export const HOPARA_TENANT: Tenant = {
  name: 'hopara.io',
  creationStatus: TenantCreationStatus.UNKNOWN
}

export class TenantService {
  async refreshAuthorization(authorization: Authorization) {
    return await getRefreshedAuthorization(authorization)
  }

  shouldReturnHopara(name: string) {
    return Config.getValue('AUTH_ENABLED') === 'false' && name === HOPARA_TENANT.name
  }

  async get(name: string, authorization: Authorization, timeout?: number): Promise<Tenant> {
    if (this.shouldReturnHopara(name)) return HOPARA_TENANT
    const refreshedAuthorization = await this.refreshAuthorization(authorization)
    const options = { withCredentials: true }
    if (!isNil(timeout)) {
      options['timeout'] = timeout
    }
    try {
      const res = await httpGet(Config.getValue('TENANT_API_ADDRESS'),
        `/tenant/${name}`,
        {},
        refreshedAuthorization,
        options)
      return res.data
    } catch (err: any) {
      throw new Error(err?.message ?? i18n('UNKNOWN_ERROR'))
    }
  }
}
