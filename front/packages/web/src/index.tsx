import '@hopara/components/src/ioc/container'
import React from 'react'
import {createRoot} from 'react-dom/client'
import Router from './router'
import HoparaProvider from '@hopara/components/src/hoc/Provider'
import {Config} from '@hopara/config'
import * as serviceWorkerRegistration from '@hopara/service-worker/src/Registration'
import { initRum } from '@hopara/rum'

window.onerror = function(msg, url, line, col, error) {
  if (error) {
    // eslint-disable-next-line no-console
    console.error(error)
  } else {
    // eslint-disable-next-line no-console
    console.error(`${msg} \nurl: ${url} \nline: ${line} \ncol: ${col}`)
  }
  return true
}

initRum({
  service: 'hopara',
  sessionReplaySampleRate: Config.getValueAsBoolean('IS_TOUCH_DEVICE') ? 0 : 100,
})

createRoot(
  document.getElementById('root') as Element)
  .render(
    <HoparaProvider>
      <Router/>
    </HoparaProvider>)

serviceWorkerRegistration.register()
