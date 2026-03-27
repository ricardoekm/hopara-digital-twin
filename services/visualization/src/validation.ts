export enum ValidationErrorSeverity {
  WARNING = 'WARNING',
  ERROR = 'ERROR'
}

export class ValidationError {
  name: string
  message?: string
  severity: ValidationErrorSeverity

  constructor(name:string, severity:ValidationErrorSeverity, message?: string) {
    this.name = name
    this.severity = severity
    this.message = message
  }
}
