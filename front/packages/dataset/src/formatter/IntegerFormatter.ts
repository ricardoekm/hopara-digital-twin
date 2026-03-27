import {ValueFormatter} from './ValueFormatter'

export class IntegerFormatter implements ValueFormatter {
  format(value: string[]): string {
    return String(value)
  }
}
