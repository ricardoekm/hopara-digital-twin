import '@hopara/components/src/ioc/container'
import React from 'react'
import {createRoot} from 'react-dom/client'
import { View } from './View'
import * as serviceWorkerRegistration from '@hopara/service-worker/src/Registration'
import { initRum } from '@hopara/rum'

initRum({
  service: 'embedded',
  sessionReplaySampleRate: 0,
  // we need to set this to true to be able to record sessions in iframes
  usePartitionedCrossSiteSessionCookie: true,
  trackViewsManually: true
})

createRoot(
  document.getElementById('root') as Element)
  .render(
    <View />)

serviceWorkerRegistration.register()
