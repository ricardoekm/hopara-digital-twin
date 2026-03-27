import { ColumnsMap } from '../../../data/ColumnsMap.js'
import {FiltersValidator} from '../../../filter/domain/filters-validator.js'
import {LayersValidator} from '../../../layer/domain/validator/layers-validator.js'
import {Visualization} from '../Visualization.js'
import { LegendsValidator } from './legends-validator.js'
import {QueryKeys} from '../../../data/QueryKeys.js'
import {QueryValidator} from '../../../data/domain/query-validator.js'
import { UserInfo } from '@hopara/http-server'
import {DatasetRepository} from '../../../dataset/dataset-repository.js'
import {SchemaRepository} from '../../../schema/schema-repository.js'
import { ValidationError, ValidationErrorSeverity } from '../../../validation.js'

export class VisualizationValidator {
  constructor(
    private readonly layersValidator: LayersValidator,
    private readonly filtersValidator: FiltersValidator,
    private readonly legendsValidator: LegendsValidator,
    private readonly queryValidator: QueryValidator,
    private readonly datasetRepository: DatasetRepository,
    private readonly schemaRepository: SchemaRepository,
  ) {
  }

  async doValidate(visualization: Visualization, columnsMap: ColumnsMap): Promise<ValidationError[]> {
    let layerErrors: ValidationError[] = []
    if (visualization.layers?.length) {
      layerErrors = await this.layersValidator.validate(visualization.layers, columnsMap)
    }

    const legendsError = this.legendsValidator.validate(visualization.legends, visualization.layers!)
    const filterErrors = await this.filtersValidator.validate(visualization.filters, columnsMap)
    return [...legendsError, ...layerErrors, ...filterErrors]
  }

  async tryValidate(visualization: Visualization, columnsMap: ColumnsMap, validQueryKeys: QueryKeys): Promise<ValidationError[]> {
    const error = await this.schemaRepository.tryValidate(Buffer.from(JSON.stringify(visualization)))
    if (error) {
      return [error]
    }
    const queryErrors = this.queryValidator.validate(visualization.getQueryKeys(), validQueryKeys)
    // To avoid redundant errors with the query
    if (queryErrors.length > 0) {
      return [...queryErrors]
    } else {
      const vizErrors = await this.doValidate(visualization, columnsMap)
      return [...vizErrors.flat()]
    }
  }

  async validate(visualization: Visualization, validate: boolean, columns: ColumnsMap | undefined, userInfo: UserInfo): Promise<ValidationError[]|undefined> {
    if (validate) {
      if (!columns) {
        columns = await this.datasetRepository.getColumns(visualization.getQueryKeys(), userInfo)
      }
      const validQueryKeys = await this.datasetRepository.getValidQueryKeys(visualization.getQueryKeys(), userInfo)
      const errors = await this.tryValidate(visualization, columns, validQueryKeys)
      if (errors.filter((e) => e.severity === ValidationErrorSeverity.ERROR).length > 0) {
        throw errors
      }

      return errors
    }
  }
}
