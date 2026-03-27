import { Debug } from './debug'

/* eslint-disable no-console */
export class Logger {
  static info(...params) : void {
    if ( !console ) return
    if (!Debug.isDebugging()) return
    return console.log('INFO:', ...params)
  }

  static debug(...params) : void {
    if ( !console ) return
    if (!Debug.isDebugging()) return
    return console.log('DEBUG:', ...params)
  }

  static warn(...params) : void {
    if ( !console ) return
    return console.warn('WARN:', ...params)
  }

  static error(...params) : void {
    if ( !console ) return
    return console.error('ERROR:', ...params)
  }
}
