import {Config} from '@hopara/config'
import {httpPost} from '@hopara/http-client'
import {Layer} from './Layer'
import {Authorization} from '@hopara/authorization'
import { classToPlain } from 'class-transformer'

export const createLayer = async (type: string, partialLayer: Partial<Layer>, authorization:Authorization): Promise<any> => {
  const plainLayer = classToPlain(partialLayer)
  const res = await httpPost(
    Config.getValue('VISUALIZATION_API_ADDRESS'),
    `layer/${type}`,
    {partialLayer: plainLayer},
    {},
    authorization,
  )
  return res.data
}
