import { Data } from './Data'

export class DataRef extends Data {
  layerId?: string

  constructor(props?: Partial<DataRef>) {
    super()
    this.layerId = props?.layerId
  }

  mergeWith(data: Data) {
    const cloned = new DataRef(this)
    cloned.source = data.source
    cloned.query = data.query
    cloned.transform = data.transform
    return cloned
  }
}

export function isDataRef(data?: DataRef | Data): data is DataRef {
  return data instanceof DataRef
}
