import {Internals} from './internals'

const HOPARA_DEBUGGER_KEY = 'debugger'
let isDebuggingCache: boolean | undefined = undefined

export class Debug {
  static enable(): void {
    isDebuggingCache = undefined
    Internals.setParam(HOPARA_DEBUGGER_KEY, 'true')
  }

  static disable(): void {
    isDebuggingCache = undefined
    Internals.setParam(HOPARA_DEBUGGER_KEY, 'false')
  }

  static isDebugging(): boolean {
    if ( isDebuggingCache !== undefined) return isDebuggingCache
    isDebuggingCache = Internals.getParam(HOPARA_DEBUGGER_KEY) === 'true'
    return isDebuggingCache
  }
}
