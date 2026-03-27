import {Columns} from '../query/Columns.js'
import { ColumnsMap } from '../ColumnsMap.js'
import { QueryKey } from '../QueryKey.js'
import isEmpty from 'lodash/fp/isEmpty.js'
import { ValidationError, ValidationErrorSeverity } from '../../validation.js'

export class ColumnsNotFoundError extends ValidationError {
  constructor(queryKey:QueryKey, error?: string ) {
    super('ColumnsError', ValidationErrorSeverity.WARNING)
    this.message = error ?? `columns for '${queryKey.getPath()}' must exist`
  }
}

export class QueryFieldSchemaError extends ValidationError {
  formatPath(path: string[]): string {
    return path.join(' -> ')
  }

  constructor(queryKey:QueryKey, fieldName: string, path: string[]) {
    super('FieldError', ValidationErrorSeverity.WARNING)
    this.message = `field '${fieldName}' must exist in the query '${queryKey.getPath()}', path: ${this.formatPath(path)}`
  }
}

export class FieldValidator {
  public fieldExists(columns: any[], field: string | null ): boolean {
    // Fields that only exists in the front-end
    if (field === '_x' || field === '_y' || field === null) {
      return true
    }

    // We'll consider only the parent when dealing with json fields
    field = field.split('.')[0]
    return columns.some((column: any) => column?.name?.toLowerCase() === field?.toLowerCase())
  }

  public validateRecursively(objToValidate: Record<string, any> | undefined, queryKey:QueryKey, columns: Columns | undefined,
                             columnsMap: ColumnsMap, path: string[]): ValidationError[] {
    if (!objToValidate) {
      return []
    }

    if (!columns) {
      return [new ColumnsNotFoundError(queryKey)]
    }

    const keys = Object.keys(objToValidate)
    if ( keys.includes('data') && !isEmpty(objToValidate.data) && !objToValidate.data.layerId ) {
      const newQueryKey = QueryKey.fromData(objToValidate.data)
      if ( newQueryKey.query !== queryKey.query || newQueryKey.source !== queryKey.source ) {
        return this.validateRecursively(objToValidate, newQueryKey, columnsMap.find(newQueryKey), columnsMap, path)
      }
    }

    return keys.flatMap((key) => {
      // Zoom jumps can use position data, we'll ignore validation for now.
      // DataRef should not be validated
      if ( objToValidate.type === 'ZOOM_JUMP' || objToValidate.data?.layerId ) {
        return []
      }

      const value = objToValidate[key]
      if (typeof value === 'object' && !isEmpty(value) ) {
        // Transform always validates on the base query
        if ( key === 'transform' ) {
          const parentQueryKey = new QueryKey({source: queryKey.source, query: queryKey.query})
          const parentColumns = columnsMap.find(parentQueryKey)
          return this.validateRecursively(value, parentQueryKey, parentColumns, columnsMap, path)
        }

        return this.validateRecursively(value, queryKey, columns, columnsMap, path.concat(key))
      }

      if (value === undefined) return []
      if (key !== 'field') return []
      if (this.fieldExists(columns, value)) return []

      return [new QueryFieldSchemaError(queryKey, value, path.concat(key))]
    }).filter((o) => !!o)
  }

  async validate(columnsMap: ColumnsMap, queryKey: QueryKey, field: string, path: string[]): Promise<ValidationError[]> {
    if ( !field ) {
      return []
    }

    const queryColumns = columnsMap.find(queryKey)
    if (!queryColumns) {
      return [new ColumnsNotFoundError(queryKey)]
    }

    if ( !this.fieldExists(queryColumns, field) ) {
      return [new QueryFieldSchemaError(queryKey, field, path)]
    }

    return []
  }
}
