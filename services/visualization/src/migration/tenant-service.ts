export class TenantService {
  static sanitize(tenant: string): string {
    return tenant.replace(/\W/g, '_')
  }
}
