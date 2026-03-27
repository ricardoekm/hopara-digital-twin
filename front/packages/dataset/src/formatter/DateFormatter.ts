import dayjs from 'dayjs'

import {ValueFormatter} from './ValueFormatter'

export class DateFormatter implements ValueFormatter {
  format(value: number): string {
    return dayjs(value).format('YYYY-MM-DD hh:mm:ss A')
  }
}
