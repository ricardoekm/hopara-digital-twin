import { Authorization } from './Authorization'

export const authorizationMock = new Authorization({
  email: 'any@email.com',
  tenant: 'any-tenant',
  tenants: ['any-tenant'],
  accessToken: 'any-access-token',
  permissions: [],
  expiration: 0,
  refreshToken: 'any-refresh-token',
})
