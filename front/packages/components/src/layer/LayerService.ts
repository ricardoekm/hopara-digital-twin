import * as LayerRepository from './LayerRepository'
import {Authorization} from '@hopara/authorization'
import {Layer} from './Layer'

export const createLayer = async (
  type: string,
  partialLayer: Partial<Layer>,
  authorization: Authorization,
): Promise<any> => {
  return LayerRepository.createLayer(type, partialLayer, authorization)
}

