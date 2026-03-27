import { ValidationError, ValidationErrorSeverity } from '../../validation.js'
import { QueryKey } from '../QueryKey.js'
import { QueryKeys } from '../QueryKeys.js'

export class QueryNotFoundError implements ValidationError {
  name: 'QueryError'
  message: string
  severity: ValidationErrorSeverity.ERROR

  constructor(queryKey:QueryKey) {
    if ( queryKey.transform ) {
      this.message = `transform '${queryKey.transform}' must exist on '${queryKey.source}/${queryKey.query}'`
    } else {
      this.message = `query '${queryKey.query}' must exist on '${queryKey.source}'`
    }
  }
}

export class QueryValidator {
  validate(queryKeys:QueryKeys, validQueryKeys:QueryKeys): ValidationError[] {
    const invalidQueryKeys = queryKeys.filter((queryKey:QueryKey) => queryKey.query && queryKey.source && !validQueryKeys.hasQuery(queryKey))
    return invalidQueryKeys.map((invalidQueryKey) => new QueryNotFoundError(invalidQueryKey))
  }
}
