import {FieldValidator} from './field-validator.js'
import {QueryKey} from '../QueryKey.js'
import {ColumnsMap} from '../ColumnsMap.js'
import {Columns} from '../query/Columns.js'
import { ValidationErrorSeverity } from '../../validation.js'

describe('validateRecursively', () => {
  it('should return empty array if no object is provided', () => {
    const fieldValidator = new FieldValidator()
    expect(fieldValidator.validateRecursively(undefined, new QueryKey({}), new Columns(), new ColumnsMap(), [])).toEqual([])
  })

  it('should return an error if no columns are provided', () => {
    const fieldValidator = new FieldValidator()
    expect(fieldValidator.validateRecursively({}, new QueryKey({
      source: 'any-source',
      query: 'any-query',
    }), undefined, new ColumnsMap(), [])).toEqual([{
      severity: ValidationErrorSeverity.WARNING,
      name: 'ColumnsError',
      message: 'columns for \'any-source/any-query\' must exist',
    }])
  })

  it('should return an error if the field does not exist and object contains its own data', () => {
    const fieldValidator = new FieldValidator()
    expect(fieldValidator.validateRecursively({
      field: 'any-field',
      data: {
        source: 'other-source',
        query: 'other-query',
      },
    }, new QueryKey({
      source: 'any-source',
      query: 'any-query',
    }),
    new Columns(), new ColumnsMap(), [])).toEqual([{
      name: 'FieldError',
      severity: ValidationErrorSeverity.WARNING,
      message: 'field \'any-field\' must exist in the query \'other-source/other-query\', path: field',
    }])
  })

  it('should return an error if the field does not exist', () => {
    const fieldValidator = new FieldValidator()
    expect(fieldValidator.validateRecursively({
      field: 'any-field',
    }, new QueryKey({
      source: 'any-source',
      query: 'any-query',
    }),
    new Columns(), new ColumnsMap(), [])).toEqual([{
      name: 'FieldError',
      severity: ValidationErrorSeverity.WARNING,
      message: 'field \'any-field\' must exist in the query \'any-source/any-query\', path: field',
    }])
  })

  it('should return an error if the field is inside an object and does not exist', () => {
    const fieldValidator = new FieldValidator()
    expect(fieldValidator.validateRecursively({
      innerObject: {
        field: 'any-field',
      },
    }, new QueryKey({
      source: 'any-source',
      query: 'any-query',
    }),
    new Columns(), new ColumnsMap(), [])).toEqual([{
      name: 'FieldError',
      severity: ValidationErrorSeverity.WARNING,
      message: 'field \'any-field\' must exist in the query \'any-source/any-query\', path: innerObject -> field',
    }])
  })

  it('should return an error if the field does not exist and layer contains transform', () => {
    const fieldValidator = new FieldValidator()
    expect(fieldValidator.validateRecursively({
      field: 'any-field',
      transform: {
        cluster: true,
      },
    }, new QueryKey({
      source: 'any-source',
      query: 'any-query',
    }),
    new Columns(), new ColumnsMap(), [])).toEqual([{
      name: 'FieldError',
      severity: ValidationErrorSeverity.WARNING,
      message: 'field \'any-field\' must exist in the query \'any-source/any-query\', path: field',
    }])
  })

  it('should ignore data ref', () => {
    const fieldValidator = new FieldValidator()
    expect(fieldValidator.validateRecursively({
      data: {
        source: 'any-source',
        query: 'any-query',
      },
      encoding: {
        position: {
          data: {
            layerId: 'any-layer',
          },
          floor: {
            field: 'floor-field',
          },
        },
      },
    }, new QueryKey({
      source: 'any-source',
      query: 'any-query',
    }),
    new Columns(), new ColumnsMap(), [])).toEqual([])
  })
})
