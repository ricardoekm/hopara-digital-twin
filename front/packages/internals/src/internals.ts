import {isNil} from 'lodash/fp'
import { Logger } from './logger'
import ls from 'localstorage-slim'
import QueryStringParser from 'query-string'

const HOPARA_PREFIX = 'hopara-'

export class Internals {
  static init(booleanParams: string[] = []): void {
    const queryString = QueryStringParser.parse(window.location.search)
    booleanParams.forEach((param) => {
      const value = queryString[param]
      if (value === 'true') {
        this.setParam(param, true)
      } else if (value === 'false') {
        this.setParam(param, false)
      } else {
        this.setParam(param, undefined)
      }
    })
  }

  static setParam(key:string, value:any): void {
    try {
      ls.set(HOPARA_PREFIX + key, value, {ttl: 60 * 60})
    } catch (e) {
      Logger.error(new Error('Failed to set internal param ' + e))
    }
  }

  static hasParam(key:string): boolean {
    return !isNil(this.getParam(key))
  }

  static getParam(key:string): any {
    try {
      return ls.get<any>(HOPARA_PREFIX + key)
    } catch (e) {
      Logger.error(new Error('Failed to get internal param ' + e))
      return
    }
  }
}
