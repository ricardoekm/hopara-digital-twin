import {Config} from '@hopara/config'
import {Authorization} from '@hopara/authorization'
import {httpGet, httpPost} from '@hopara/http-client'
import { naturalCompare } from '@discoveryjs/natural-compare'
import { Data } from '@hopara/encoding'
import { DatasetFilters } from '@hopara/dataset'

export function fetchValues(
  data:Data,
  columnName: string,
  filterTerm: string | undefined,
  filters: DatasetFilters,
  authorization:Authorization,
  sort = false,
) {
  return httpGet(
    Config.getValue('DATASET_API_ADDRESS', authorization.tenant),
    `/view/${data.query}/column/${columnName}/value`,
    { filterTerm, limit: 100, dataSource: data.source, filter: filters },
    authorization,
    { withCredentials: true },
  ).then((res) => {
    const values = res.data.slice()
    if (!sort) return values

    values.sort(naturalCompare)
    return values
  })
}

export class FilterRepository {
  static async create(authorization: Authorization) {
    const res = await httpPost(
      Config.getValue('VISUALIZATION_API_ADDRESS'),
      `filter`,
      {},
      {},
      authorization,
    )
    return res.data
  }
}
