import { Authorization } from '@hopara/authorization'
import { getRefreshedAuthorization } from './AuthProvider'

const SIMPLE_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAaG9wYXJhLmlvIiwidGVuYW50cyI6WyJob3BhcmEuaW8iXSwicGVybWlzc2lvbnMiOltdLCJleHAiOjB9.suJQZQQ8DTjvHYkY6FsrlRhg-2gXGEv_IB_qzIaxmIM'

jest.mock('@hopara/http-client', () => ({
  httpPost: () => ({data: {
    access_token: SIMPLE_ACCESS_TOKEN,
    refresh_token: 'anyRefreshedToken',
  }}),
}))

describe('getRefreshedAuthorization', () => {
  test('should return same authorization if refreshToken is not present', async () => {
    const authorization = Authorization.createEmpty()
    const refreshedAuthorization = await getRefreshedAuthorization(authorization)
    expect(refreshedAuthorization).toEqual(authorization)
  })

  test('should return same authorization if token is not expired', async () => {
    const authorization = new Authorization({refreshToken: 'anyRefreshToken', expiration: Date.now() / 1000 + 10000})
    const refreshedAuthorization = await getRefreshedAuthorization(authorization)
    expect(refreshedAuthorization).toEqual(authorization)
  })

  test('should refresh token if it is expired', async () => {
    const authorization = new Authorization({refreshToken: 'anyRefreshToken', expiration: Date.now() / 1000 - 10000})
    const refreshedAuthorization = await getRefreshedAuthorization(authorization)
    expect(refreshedAuthorization.accessToken).toEqual(SIMPLE_ACCESS_TOKEN)
    expect(refreshedAuthorization.refreshToken).toEqual('anyRefreshedToken')
  })
})
