import {Config} from '@hopara/config'
import {httpGet} from '@hopara/http-client'
import {Authorization} from '@hopara/authorization'

export const listTemplates = async (authorization:Authorization): Promise<any> => {
  const res = await httpGet(
    Config.getValue('VISUALIZATION_API_ADDRESS'),
    `layer-template`,
    {},
    authorization,
  )
  return res.data
}

