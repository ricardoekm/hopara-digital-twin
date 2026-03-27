import { ValidationError, ValidationErrorSeverity } from '../validation.js'

export class LayerNotFoundError extends ValidationError {
  constructor(layerId: string, callerType: string) {
    super('LayerNotFoundError',
          ValidationErrorSeverity.ERROR,
        `layer '${layerId}' referenced by ${callerType} not found`)
  }
}
