import React from 'react'
import {Logger} from '@hopara/internals'
import { Authorization, AuthRepository } from '@hopara/authorization'
import { AuthContext, AuthStatus } from './AuthContext'
import { Config } from '@hopara/config'
import { AuthService } from './AuthService'
import { Page, PageType, Pages } from '@hopara/page/src/Pages'
import { httpPost } from '@hopara/http-client'
import { Navigate } from 'react-router-dom'
import {LoadingSpinner} from '@hopara/design-system/src/loading-spinner/Spinner'

const TEST_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAaG9wYXJhLmlvIiwidGVuYW50cyI6WyJ0ZXN0Il0sInNjb3BlIjoiYXBwOmxpc3QgYXBwOnJlYWQgcmVzb3VyY2U6cmVhZCByb3c6cmVhZCB0ZW5hbnQ6cmVhZCByZXNvdXJjZTp3cml0ZSByb3c6d3JpdGUgZGF0YS1zb3VyY2U6cmVhZCBhcHA6d3JpdGUgdGFibGU6d3JpdGUgZGF0YS1zb3VyY2U6d3JpdGUgdmlldzp3cml0ZSIsImlhdCI6MTY2NTAxMTIzNiwiZXhwIjoyMDMzOTI1NjU1fQ.8DhnFHuaBRX9YJCNznVLFPPTgf9gK-WB0CSDRbAgEZI'
const TEST_REFRESH_TOKEN = 'any-refresh-token'

interface Props extends React.PropsWithChildren {
  authorization: Authorization
  authStatus: AuthStatus
  visualizationId: string
  onSignedIn: (authorization: Authorization, status: AuthStatus) => void
  onSignedOut: () => void
  onTokenRefreshed: (authorization: Authorization) => void
  onChangeStatus: (authStatus: AuthStatus) => void
  onTenantChanged: (tenant: string) => void
  matchedRoute?: {
    params: Record<string, string>
    pathname: string
    route: Page
  }
}

export const getRefreshedAuthorization = async (authorization: Authorization) => {
  if (!authorization?.refreshToken || !AuthRepository.isTokenExpired(authorization)) return authorization

  try {
    const cached = AuthRepository.getCachedRefreshedToken(authorization)
    if (cached) return cached

    const isUserToken = authorization.accessToken && authorization.email
    const payload = isUserToken ? {email: authorization.email} : {clientId: authorization.clientId}

    const res = await httpPost(Config.getValue('AUTH_API_ADDRESS'), '/refresh-token', {
      ...payload,
      refreshToken: authorization.refreshToken,
    })

    const refreshedAuthorization = AuthRepository.createAuthorization({
      accessToken: await res.data.access_token,
      refreshToken: await res.data.refresh_token,
      urlParams: {tenant: authorization.tenant},
    })

    if (!refreshedAuthorization?.accessToken) return Authorization.createEmpty()

    // we use old authorization as key to cache refreshed token
    AuthRepository.saveCachedRefreshedToken(authorization, refreshedAuthorization.accessToken)
    return refreshedAuthorization
  } catch {
    return Authorization.createEmpty()
  }
}

export class AuthProvider extends React.PureComponent<Props> {
  changeTenant(tenant: string, callback?: (teanant: string) => void) {
    this.props.onTenantChanged(tenant)
    AuthRepository.saveCurrentTenant(tenant)
    if (callback) callback(tenant)
  }

  async refreshToken(authorization: Authorization) {
    return getRefreshedAuthorization(authorization)
  }

  shouldRefreshToken() {
    return this.props.authorization?.accessToken &&
           this.props.authorization?.refreshToken &&
           AuthRepository.isTokenExpired(this.props.authorization)
  }


  shouldChangeTenant(newTenant?: string) {
    return this.props.authorization?.tenant && newTenant && this.props.authorization.tenant != newTenant
  }

  getUrlParams() {
    return this.props.matchedRoute?.params || {}
  }

  createAuthorization(accessToken: string, refreshToken: string) {
    if (Config.getValueAsBoolean('SYSTEM_TEST') && !Config.getValueAsBoolean('IS_EMBEDDED')) {
      return AuthRepository.createAuthorization({
        accessToken: TEST_ACCESS_TOKEN,
        refreshToken: TEST_REFRESH_TOKEN,
        urlParams: this.getUrlParams(),
      })
    }

    return AuthRepository.createAuthorization({
      accessToken,
      refreshToken,
      urlParams: this.getUrlParams(),
    })
  }

  async handleSignedIn(accessToken, refreshToken) {
    const authEnabled = Config.getValue('AUTH_ENABLED') !== 'false'
    if (!authEnabled) return this.props.onSignedIn(Authorization.createDefault(), AuthStatus.SignedIn)

    const authorization = this.createAuthorization(accessToken, refreshToken)
    const refreshedAuthorization = await this.refreshToken(authorization)

    if (!refreshedAuthorization?.accessToken && this.props.authStatus !== AuthStatus.SignedOut && !Config.getValueAsBoolean('IS_EMBEDDED')) {
      this.props.onChangeStatus(AuthStatus.SignedOut)
    }
    if (!refreshedAuthorization?.accessToken || this.props.authStatus === AuthStatus.SignedIn) return

    AuthRepository.saveTokens(refreshedAuthorization)
    if (this.props.onSignedIn) this.props.onSignedIn(refreshedAuthorization, AuthStatus.SignedIn)
  }

  async handleRefreshToken() {
    const refreshedAuthorization = await this.refreshToken(this.props.authorization)
    if (refreshedAuthorization.accessToken !== this.props.authorization.accessToken) this.props.onTokenRefreshed(refreshedAuthorization)
  }

  signedOutRedirect() {
    AuthRepository.removeTokens()
    localStorage.setItem('callback_url', window.location.pathname + window.location.search)

    if (Config.getValueAsBoolean('IS_EMBEDDED')) {
      return <Navigate to={Pages.getPath(PageType.Forbidden, undefined, Config.getValue('BASE_PATHNAME'))} replace />
    }

    const samlSignOutUrl = localStorage.getItem('samlSignOutUrl') || undefined
    if (samlSignOutUrl) localStorage.removeItem('samlSignOutUrl')

    return <Navigate to={samlSignOutUrl ?? '/auth'} replace />
  }

  isIdle() {
    return this.props.authStatus === AuthStatus.Idle
  }
  
  shouldRedirectToAuth() {
    const isSignedOut = !this.isIdle() && this.props.authStatus === AuthStatus.SignedOut
    return !Config.getValueAsBoolean('IS_EMBEDDED') && isSignedOut && (!this.props.matchedRoute || this.props.matchedRoute?.route?.authenticated)
  }

  shouldRedirectToHome() {
    return !Config.getValueAsBoolean('IS_EMBEDDED') && !this.isIdle() && this.props.authStatus === AuthStatus.SignedIn && !this.props.matchedRoute
  }

  shouldRedirectToForbidden() {
    const isForbiddenPath = this.props.matchedRoute?.route.type === PageType.Forbidden
    if (isForbiddenPath || this.isIdle()) return false

    const isTokenInvalid = !!this.props.authorization.accessToken && !this.props.authorization.tenant
    if (isTokenInvalid) return true

    const isCurrentTenantDisallowed = !!this.props.authorization.tenant && !AuthRepository.isTenantAllowed(this.props.authorization.tenant, this.props.authorization.tenants)
    if (isCurrentTenantDisallowed) return true

    const userHasPagePermission = this.props.matchedRoute?.route.permission ? this.props.authorization.hasPermission(this.props.matchedRoute.route.permission) : true
    return !userHasPagePermission
  }

  shouldBlockAccess() {
    return this.isIdle() || this.shouldRedirectToAuth() || this.shouldRedirectToHome() || this.shouldRedirectToForbidden()
  }

  renderBlockedAccess() {
    if (this.shouldRedirectToAuth()) return this.signedOutRedirect()
    if (this.shouldRedirectToForbidden()) return <Navigate to={Pages.getPath(PageType.Forbidden)} replace />
    if (this.shouldRedirectToHome()) return <Navigate to={Pages.getPath(PageType.ListVisualizations, {tenant: this.props.authorization.tenant})} replace />
    return <LoadingSpinner fullscreen={true}/>
  }

  shouldRedirectToViz() {
    return Config.getValueAsBoolean('IS_EMBEDDED') && this.props.authorization.tenant && this.props.visualizationId && !this.props.matchedRoute
  }

  redirectToViz() {
    return <Navigate to={Pages.getPath(PageType.VisualizationDetail, { tenant: this.props.authorization.tenant, visualizationId: this.props.visualizationId })} replace />
  }

  componentDidMount(): void {
    try {
      const {accessToken, refreshToken} = AuthRepository.getTokens()
      this.handleSignedIn(accessToken, refreshToken)
    } catch (error: any) {
      Logger.error(error)
    }
  }

  componentDidUpdate(): void {
    if (this.shouldRefreshToken()) {
      this.handleRefreshToken()
    }

    if (this.shouldChangeTenant(this.props.matchedRoute?.params.tenant)) {
      this.changeTenant(this.props.matchedRoute!.params.tenant)
    }
  }

  render() {
    if (this.shouldBlockAccess()) return this.renderBlockedAccess()
    if (this.shouldRedirectToViz()) return this.redirectToViz()

    return (
      <AuthContext.Provider
        value={{
          authStatus: this.props.authStatus,
          authorization: this.props.authorization,
          authService: new AuthService(this.handleSignedIn.bind(this)),
          signOut: this.props.onSignedOut,
          getRefreshedAuthorization: () => this.refreshToken(this.props.authorization),
        }}>
        {this.props.children}
      </AuthContext.Provider>
    )
  }
}
