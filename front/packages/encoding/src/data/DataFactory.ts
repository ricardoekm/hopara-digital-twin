import { Data } from './Data'
import { DataRef } from './DataRef'

export const plainToData = ({ value }) => {
  return value && 'layerId' in value ? new DataRef(value) : value ? new Data(value) : undefined
}
