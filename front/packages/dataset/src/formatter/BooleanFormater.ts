import {ValueFormatter} from './ValueFormatter'

export class BooleanFormatter implements ValueFormatter {
  format(value: string[]): string {
    return String(value)
  }
}
