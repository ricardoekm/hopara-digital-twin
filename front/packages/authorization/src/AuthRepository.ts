import ls from 'localstorage-slim'
import { Authorization } from './Authorization'
import jwtDecode from 'jwt-decode'

const CHACHE_TOKEN_KEY = 'hopara-cached-token'

interface CachedToken {
  accessToken: string
  refreshToken: string
  refreshedToken: string
}

export function isPersonalSpace(email?: string, tenant?: string): boolean {
  return tenant === email
}

export class AuthorizationRepository {
  static saveTokens(auth: Authorization) {
    const ttl = 60 * 60 * 24 * 7 * 30 // 30 days
    ls.set('accessToken', auth.accessToken, {ttl})
    ls.set('refreshToken', auth.refreshToken, {ttl})
  }
  
  static removeTokens() {
    ls.remove('accessToken')
    ls.remove('refreshToken')
  }
  
  static getTokens() {
    return {
      accessToken: ls.get<string>('accessToken') ?? undefined,
      refreshToken: ls.get<string>('refreshToken') ?? undefined,
    }
  }

  static isTokenExpired(authorization: Authorization) {
    return (authorization.expiration * 1000) < Date.now()
  }

  static saveCurrentTenant(tenant: string) {
    ls.set('currentTenant', tenant)
  }

  static getCurrentTenant(authorization: Partial<Authorization>, urlParams) {
    const pathTenant = this.getTenantFromPath(urlParams)
    const persistedTenant = this.getPersistedTenant(authorization.tenants)
    if (pathTenant) return pathTenant
    if (persistedTenant) return persistedTenant
    if (authorization.tenant) return authorization.tenant
    return authorization?.tenants![0]
  }

  static getAllowedCurrentTenant(authorization: Partial<Authorization>, urlParams): string | undefined {
    const currentTenant = this.getCurrentTenant(authorization, urlParams)
    const allowed = AuthorizationRepository.isTenantAllowed(currentTenant, authorization.tenants)
    if (allowed) {
      AuthorizationRepository.saveCurrentTenant(currentTenant)
      return currentTenant
    }
  }

  static isTenantAllowed(tenant?: string, tenants?: string[]) {
    if (!tenant || !tenants?.length) return false
    return tenants.includes(tenant)
  }

  private static getTenantFromPath(urlParams: any) {
    const pathTenant = urlParams?.tenant
    return pathTenant !== 'auth' && pathTenant ? pathTenant : undefined
  }
  
  private static getPersistedTenant(tenants?: string[]) {
    const tenant = ls.get<string>('currentTenant') ?? undefined
    return AuthorizationRepository.isTenantAllowed(tenant, tenants) ? tenant : undefined 
  }
  
  static createAuthorization({accessToken, urlParams, refreshToken}) {
    if (!accessToken) return Authorization.createEmpty()
  
    const accessTokenDecoded = jwtDecode<any>(accessToken)
    const {email, tenants, exp} = accessTokenDecoded
    const tenant = this.getAllowedCurrentTenant(accessTokenDecoded, urlParams)
    const permissions = (accessTokenDecoded.scope ?? '').split(' ')
  
    return new Authorization({
      accessToken,
      refreshToken,
      tenant,
      tenants,
      email,
      permissions,
      expiration: exp,
    })
  }

  static getCachedRefreshedToken(authorization: Authorization) {
    const cached = ls.get<CachedToken>(CHACHE_TOKEN_KEY)
    if (!cached || (cached.accessToken !== authorization.accessToken && cached.refreshToken !== authorization.refreshToken)) return
    
    const refreshedAuthorization = this.createAuthorization({
      accessToken: cached.refreshedToken,
      refreshToken: authorization.refreshToken,
      urlParams: {},
    })

    if (this.isTokenExpired(refreshedAuthorization)) {
      ls.remove(CHACHE_TOKEN_KEY)
      return
    }

    return refreshedAuthorization
  }

  static saveCachedRefreshedToken(authorization: Authorization, refreshedToken: string) {
    ls.set(CHACHE_TOKEN_KEY, {
      accessToken: authorization.accessToken,
      refreshToken: authorization.refreshToken,
      refreshedToken,
    })
  }
}
