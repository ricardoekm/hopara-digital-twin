import { Config } from '@hopara/config'
import { Queries, Query } from '@hopara/dataset'
import { httpGet } from '@hopara/http-client'
import { Authorization } from '@hopara/authorization'
import { plainToInstance } from 'class-transformer'

export async function getQueries(authorization: Authorization) : Promise<Queries> {
  const response = await httpGet(Config.getValue('DATASET_API_ADDRESS', authorization.tenant), `/view`, {fullResponse: true}, authorization)
  const body = await response.data
  return new Queries(...plainToInstance(Query, body))
}
