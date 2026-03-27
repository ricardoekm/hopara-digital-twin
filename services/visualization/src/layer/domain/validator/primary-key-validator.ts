import isEmpty from 'lodash/fp/isEmpty.js'
import { ColumnsMap } from '../../../data/ColumnsMap.js'
import { QueryKey } from '../../../data/QueryKey.js'
import { ValidationError, ValidationErrorSeverity } from '../../../validation.js'
import LayerImpl from '../LayerImpl.js'

export class PrimaryKeyValidator {
  generateError(queryKey:QueryKey, layer: LayerImpl): ValidationError {
    let message = 'Using position in Hopara requires a primary key in the query: ' + queryKey.getId()
    message += '. Error in layer ' + layer.id
    return new ValidationError('NoPrimaryKeyError', ValidationErrorSeverity.ERROR, message)
  }

  validate(layer:LayerImpl, columnsMap:ColumnsMap) : ValidationError | undefined {
    const positionData = layer.encoding.position?.data
    if ( !isEmpty(positionData) && !positionData.layerId ) {
      // Some transforms are front-end only and don't have primary keys in the column map (e.g. cluster)
      // so we'll use the base query key for validation
      const layerColumns = columnsMap.find(layer.getBaseQueryKey())
      if ( !layerColumns.hasPrimaryKey() ) {
        return this.generateError(layer.getQueryKey(), layer)
      }

      const positionQueryKey = QueryKey.fromData(positionData)
      const positionColumns = columnsMap.find(positionQueryKey)
      if ( !positionColumns.hasPrimaryKey() ) {
        return this.generateError(positionQueryKey, layer)
      }
    }

    return
  }
}
