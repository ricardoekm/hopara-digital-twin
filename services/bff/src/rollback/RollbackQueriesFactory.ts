import { QueryKey } from '../query/Query'
import { Visualization } from '../visualization/Visualization'

export type RollbackQuery = {
  queryKey: QueryKey
  imageScope?: string
  modelScope?: string
}

export class RollbackQueriesFactory {
  static getResourceScope(resourceEncoding:any | undefined, queryKey: QueryKey, visualizationScope: string) {
    if ( resourceEncoding?.scope ) {
      return resourceEncoding.scope
    }

    const resourceScope = `${queryKey.name}-${queryKey.dataSource}`
    if (visualizationScope) {
      return resourceScope + '-' + visualizationScope
    }

    return resourceScope
  }

  static createRollbackQuery(layer:any, visualizationScope: string) : RollbackQuery {
    const positionQueryKey = {
        dataSource: layer.encoding.position.data.source,
        name: layer.encoding.position.data.query,
    }

    const queryKey = {
      dataSource: layer.data.source,
      name: layer.data.query,
    }

    if ( layer.type === 'image' ) {
      return {queryKey: positionQueryKey, 
              imageScope: this.getResourceScope(layer.encoding.image, queryKey, visualizationScope)}
    } else if ( layer.type === 'model') {
      return {queryKey: positionQueryKey, 
              modelScope: this.getResourceScope(layer.encoding.model, queryKey, visualizationScope)}
    }

    return {queryKey: positionQueryKey}
  }
  
  static getQueries(visualization:Visualization) : RollbackQuery[] {
    const queries = visualization.layers?.map((layer) => {
    const positionEncoding = layer.encoding?.position
    if (positionEncoding?.data && positionEncoding.data.query && positionEncoding.data.query.endsWith('_pos')) {
      return this.createRollbackQuery(layer, visualization.scope)
    }
})

    return queries?.filter((query) => !!query) as RollbackQuery[]
  }
}
