import {httpGet} from '@hopara/http-client'

import {Config} from '@hopara/config'

export async function getSchema() : Promise<any> {
  const response = await httpGet(Config.getValue('VISUALIZATION_API_ADDRESS'), '/schema')
  return await response.data
}
