 /* eslint-disable no-redeclare */
import { isPortuguese } from '@hopara/browser'
import {stringsEnUs} from './EnUs'
import {stringsPtBr} from './PtBr'

let currentLang = 'en'
export const i18nLocale = (lang: string) => currentLang = lang

type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never
}[keyof T];

type FP<T> = Pick<T, FunctionPropertyNames<T>>;

type I18N = typeof stringsEnUs
type PartialI18N = Partial<I18N>

const getString = (key: keyof typeof stringsEnUs, customMap?: PartialI18N) => {
  return customMap && customMap[key] ? customMap[key] : isPortuguese(currentLang) ? stringsPtBr[key] : stringsEnUs[key]
}

function i18nBase(i18n: PartialI18N | undefined, key: keyof I18N, ...args) {
  const prop = getString(key, i18n)
  if (typeof prop === 'function') {
    return (prop as any)(...args)
  }
  return prop
}

export function i18n(key: keyof I18N, params: void): string;
export function i18n<K extends keyof FP<I18N>>(
  key: K,
  ...params: Parameters<I18N[K] extends (...args: any[]) => any ? I18N[K] : never>
): string;
export function i18n(key: keyof I18N, ...args) {
  return i18nBase(undefined, key, ...args)
}

export function i18nWithNoBreaks<K>(propertyName: K, params: void): string;
export function i18nWithNoBreaks<K extends keyof FP<I18N>>(
  propertyName: K,
  ...args: Parameters<I18N[K] extends (...args: any[]) => any ? I18N[K] : never>
): string;
export function i18nWithNoBreaks(key: keyof I18N, ...args) {
  return i18n(key, ...args).replace(/\n/g, ' ')
}
