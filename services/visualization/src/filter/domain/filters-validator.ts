import { ColumnsMap } from '../../data/ColumnsMap.js'
import { FieldValidator } from '../../data/domain/field-validator.js'
import { ValidationError } from '../../validation.js'
import Filter from './Filter.js'

export class FiltersValidator {
  private fieldValidator: FieldValidator
  constructor(fieldValidator: FieldValidator) {
    this.fieldValidator = fieldValidator
  }
  async validate(filters: Filter[] | undefined, columnsMap: ColumnsMap): Promise<ValidationError[]> {
    if ( !filters ) return []

    return (await Promise.all((filters).map(async (filter) => {
      return this.fieldValidator.validate(columnsMap, filter.getQueryKey(), filter.field, ['filters', filter.id])
  }))).flat()
  }
}
