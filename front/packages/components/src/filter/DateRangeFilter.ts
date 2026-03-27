import dayjs from 'dayjs'
import 'dayjs/locale/en'
import 'dayjs/locale/pt-br'
import localeData from 'dayjs/plugin/localeData'
import {i18n} from '@hopara/i18n'
import { FilterValue } from './domain/SelectedFilter'

dayjs.extend(localeData)

export enum DateRangeFilterOption {
  past1Hour = 'past1Hour',
  past6Hours = 'past6Hours',
  past1Day = 'past1Day',
  past1Week = 'past1Week',
  past1Month = 'past1Month',
}

export const dateRangeOptions = [
  {value: DateRangeFilterOption.past1Hour, label: i18n('PAST_1_HOUR')},
  {value: DateRangeFilterOption.past6Hours, label: i18n('PAST_6_HOURS')},
  {value: DateRangeFilterOption.past1Day, label: i18n('PAST_1_DAY')},
  {value: DateRangeFilterOption.past1Week, label: i18n('PAST_1_WEEK')},
  {value: DateRangeFilterOption.past1Month, label: i18n('PAST_1_MONTH')},
]

export type DateRangeValue = (string | undefined)[] | [DateRangeFilterOption]

export const getDatesFromRangeOption = (rangeOption?: DateRangeFilterOption): DateRangeValue => {
  const nowStr = new Date().toISOString()
  switch (rangeOption) {
    case DateRangeFilterOption.past1Hour:
      return [dayjs().subtract(1, 'hour').toISOString()]
    case DateRangeFilterOption.past6Hours:
      return [dayjs().subtract(6, 'hour').toISOString()]
    case DateRangeFilterOption.past1Day:
      return [dayjs().subtract(1, 'day').toISOString()]
    case DateRangeFilterOption.past1Week:
      return [dayjs().subtract(1, 'week').toISOString()]
    case DateRangeFilterOption.past1Month:
      return [dayjs().subtract(1, 'month').toISOString()]
    default:
      return [nowStr, nowStr]
  }
}

export function stringIsDate(dateString?: any): boolean {
  return !isNaN(Date.parse(dateString ?? ''))
}

export function getCurrentLocale() {
  return navigator.language === 'pt-BR' ? 'pt-br' : 'en'
}

export function isDatePresetString(values: FilterValue[]): boolean {
  return Object.values(DateRangeFilterOption).includes(values[0] as any)
}

export function getDatesFromRangeOptionArray(values: FilterValue[]) {
  return isDatePresetString(values) ? getDatesFromRangeOption(values[0] as any) : values
}
 export function dateRangeToString(values: string[]): string {
  const dateStr1 = dayjs(values[0]).format('MM/DD/YYYY hh:mmA')
  const dateStr2 = values[1] ? dayjs(values[1]).format('MM/DD/YYYY hh:mmA') : dayjs().format('MM/DD/YYYY hh:mmA')
  return isDatePresetString(values) ? dateRangeOptions.find((o) => o.value === values[0])?.label ?? '' : `${dateStr1} – ${dateStr2}`
 }


