import {Authorization} from '@hopara/authorization'
import {httpGet, httpPost} from '@hopara/http-client'
import {Config} from '@hopara/config'
import {Floors} from './Floors'

export class FloorRepository {
  static async list(scope:string, authorization: Authorization): Promise<Floors> {
    const response = await httpGet(
      Config.getValue('DATASET_API_ADDRESS'),
      `floor`,
      {
        scope,
      },
      authorization,
    )
    return await response.data
  }

  static async save(floors: Floors, scope:string, authorization: Authorization) {
    const response = await httpPost(
      Config.getValue('DATASET_API_ADDRESS'),
      `floor`,
      floors,
      {scope},
      authorization,
    )
    return await response.data
  }

  static async loadAcronyms(floors: Floors, authorization: Authorization) {
    const response = await httpGet(
      Config.getValue('RESOURCE_API_ADDRESS'),
      'floor-names',
      {name: floors.map((floor) => floor.name)},
      authorization,
    )
    return await response.data
  }
}
