import { ColumnsMap } from '../../../data/ColumnsMap.js'
import {FieldValidator} from '../../../data/domain/field-validator.js'
import { ValidationError, ValidationErrorSeverity } from '../../../validation.js'
import LayerImpl from '../LayerImpl.js'
import { PrimaryKeyValidator } from './primary-key-validator.js'

export class LayerValidator {
  constructor(private readonly fieldValidator: FieldValidator,
              private readonly primaryKeyValidator: PrimaryKeyValidator) {
  }

  async validate(layer: LayerImpl, layers: LayerImpl[], columnsMap: ColumnsMap): Promise<ValidationError[]> {
    if ( !layer.data?.query || !layer.data?.source ) {
      return []
    }

    const refLayer = layer.encoding.position?.data?.layerId ? layers.find((l) => l.id === layer.encoding.position?.data.layerId) : undefined
    if ( layer.encoding.position?.data?.layerId && !refLayer ) {
      return [new ValidationError('RefError',
                                 ValidationErrorSeverity.WARNING,
                                `Ref layer ${layer.encoding.position?.data.layerId} does not exist`)]
    }

    const error = this.primaryKeyValidator.validate(layer, columnsMap)
    if ( error ) {
      return [error]
    }

    const columns = columnsMap.find(layer.getQueryKey())
    return this.fieldValidator.validateRecursively(layer, layer.getQueryKey(), columns, columnsMap, ['layers', layer.name!])
  }
}

