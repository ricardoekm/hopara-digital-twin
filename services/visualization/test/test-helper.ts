import {AwilixContainer} from 'awilix'
import {UserInfo} from '@hopara/http-server'
import {v4 as uuid} from 'uuid'

export const getToken = async (container: AwilixContainer): Promise<string> => {
  return 'any-token'
}

export const getFakeId = (): string => 'fake-' + uuid()

export const getFakeUserInfo = (email?: string): UserInfo => ({
  email: email ?? 'user1@gmail.com',
  authorization: 'any-token',
  tenant: 'hopara.io',
} as UserInfo)
