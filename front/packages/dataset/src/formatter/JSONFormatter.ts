import {ValueFormatter} from './ValueFormatter'

export class JSONFromater implements ValueFormatter {
  format(value: any): string {
    return JSON.stringify(value)
  }
}
