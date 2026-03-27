import { Permission } from './Permissions'

const DEFAULT_TENANT = 'hopara.io'

export class Authorization {
  public readonly accessToken: string
  public readonly tenants: string[]
  public readonly refreshToken: string
  public readonly tenant: string
  public readonly permissions: Array<Permission | string>
  public readonly email: string
  public readonly clientId: string
  public readonly sessionId: string
  public readonly expiration: number

  constructor(params: Partial<Authorization> & {sessionId?: string}) {
    this.accessToken = params.accessToken!
    this.refreshToken = params.refreshToken!
    this.tenant = params.tenant!
    this.tenants = params.tenants!
    this.email = params.email ?? ''
    this.clientId = params.clientId || this.email
    this.permissions = params.permissions!
    this.expiration = params.expiration!
    this.sessionId = params.sessionId!
  }

  static createEmpty() {
    return new Authorization({
      accessToken: '',
      refreshToken: '',
      tenant: '',
      tenants: [],
      email: '',
      permissions: [],
      expiration: 0,
    })
  }

  static createDefault() {
    const exp = new Date()
    exp.setFullYear(exp.getFullYear() + 100)

    return new Authorization({
      accessToken: '',
      refreshToken: '',
      tenant: DEFAULT_TENANT,
      tenants: [DEFAULT_TENANT],
      email: '',
      permissions: Object.values(Permission),
      expiration: exp.getUTCSeconds(),
    })
  }

  isDefault() {
    return !this.accessToken && this.tenant === DEFAULT_TENANT
  }

  setTenant(tenant: string) {
    return new Authorization({
      ...this,
      tenant,
    })
  }

  setSessionId(sessionId:string) {
    return new Authorization({
      ...this,
      sessionId,
    })
  }

  hasPermission(permission: Permission) {
    return this.permissions.includes(permission)
  }

  canEditVisualization(): boolean {
    return this.hasPermission(Permission.APP_WRITE)
  }

  canListVisualizations(): boolean {
    return this.hasPermission(Permission.APP_LIST)
  }

  canReadVisualization(): boolean {
    return this.hasPermission(Permission.APP_READ)
  }

  canEditRow(): boolean {
    return this.hasPermission(Permission.ROW_WRITE)
  }

  canListDataSources(): boolean {
    return this.hasPermission(Permission.DATASOURCE_LIST)
  }

  canEditDataSources(): boolean {
    return this.hasPermission(Permission.DATASOURCE_WRITE)
  }

  canEditResources(): boolean {
    return this.hasPermission(Permission.RESOURCE_WRITE)
  }

  toHTTPHeaders() {
    return {
      'Authorization': this.accessToken ? 'Bearer ' + this.accessToken : undefined,
      'tenant': this.tenant,
      'Session-Id': this.sessionId,
    }
  }
}
