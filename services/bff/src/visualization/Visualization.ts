import {isEqual, uniqWith} from 'lodash/fp'
import {Column} from '../query/Column'
import {QueryKey} from '../query/Query'

type Filter = {
  field: string
  data: { source: string, query: string }
  values?: string[]
}

export enum InitialPositionType {
  FIXED = 'FIXED',
  FIT_TO_CONTENT = 'FIT_TO_CONTENT'
}

export interface InitialPosition {
  type?: InitialPositionType
  layerId?: string
}

export class Visualization {
  scope: string
  fallback?: boolean
  initialPosition?: InitialPosition
  filters?: Filter[]
  layers: any[]
  id: string
  type: string

  constructor(props: Partial<Visualization>) {
    Object.assign(this, props)
    this.id = String(props.id)
  }

  clone(): Visualization {
    return new Visualization(this)
  }

  getUniqueFilterColumns(): Column[] {
    const columns: Column[] = []
    if (!this?.filters) return []
    this.filters.forEach((filter) => {
      columns.push({
        name: filter.field,
        query: filter.data.query,
        dataSource: filter.data.source,
      })
    })
    return uniqWith(isEqual, columns)
  }

  getPositionData(layer:any) : any {
    if ( !layer ) {
      return
    }

    if ( layer.encoding?.position?.type === 'REF' && layer.encoding?.position?.data.layerId ) {
      const refLayer = this.layers.find((l) => l.id === layer.encoding?.position?.data.layerId)
      return this.getPositionData(refLayer)
    } else if ( layer.encoding?.position?.type === 'CLIENT' ) {
      return layer.data
    } else if ( layer.encoding?.position?.data ) {
      return layer.encoding?.position?.data
    } else {
      // Filled by position auto fill on the front end
      return {source: 'hopara', query: layer.data.query + '_' + layer.data.source + '_pos'}
    } 
  }

  getLayerDataList(layer:any) : any[] {
    const dataList = []

    // Filters empty data and data pointing to other layer
    if ( layer.data && layer.data.source && layer.data.query ) {
      dataList.push(layer.data)

      const positionData = this.getPositionData(layer)
      if ( positionData ) {
        dataList.push(positionData)
      }
    }

    return dataList
  }

  getLayer(layerId: string) {
    return this.layers.find((layer) => layer.id === layerId)
  }

  getQueryKeys(): QueryKey[] {
    const dataList = this.layers?.map(this.getLayerDataList.bind(this))?.flat() ?? []
    this.filters?.forEach((filter) => dataList.push(filter.data))
    return uniqWith(isEqual, dataList.map((data) => {
      return {
        name: data.query,
        dataSource: data.source,
      }
    }))
  }
}
