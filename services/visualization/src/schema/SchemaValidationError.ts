import { ValidationError, ValidationErrorSeverity } from '../validation.js'

export class SchemaValidationError extends ValidationError {
  errors: any[]

  constructor(e) {
    super('SchemaError', ValidationErrorSeverity.ERROR)
    this.errors = e
  }
}
