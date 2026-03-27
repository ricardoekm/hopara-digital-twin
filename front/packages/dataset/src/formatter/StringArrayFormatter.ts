import {ValueFormatter} from './ValueFormatter'

export class StringArrayFormatter implements ValueFormatter {
  format(value: string[]): string {
    return value.join(', ')
  }
}
