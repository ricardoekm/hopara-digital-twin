import {datadogRum} from '@datadog/browser-rum'
import { Config, ConfigEnvironment } from '@hopara/config'
import { Internals } from '@hopara/internals'

export function shouldSend(event) {
  if (event.type === 'resource') {
    return !event.resource.url.includes('/icon/')
  }

  return true
}

export const initRum = (options: {service: string, sessionReplaySampleRate: number, usePartitionedCrossSiteSessionCookie?: boolean, trackViewsManually?: boolean}) => {
  const isProd = Config.environment === ConfigEnvironment.PRODUCTION
  const isE2E = Internals.getParam('test') === true
  const shouldRun = isProd && !isE2E

  if (shouldRun) {
    const config = {
      ...options,
      applicationId: Config.getValue('DATADOG_RUM_APPLICATION_ID'),
      clientToken: Config.getValue('DATADOG_RUM_CLIENT_TOKEN'),
      site: Config.getValue('DATADOG_RUM_SITE') as any,
      version: Config.getValue('PACKAGE_VERSION'), // Specify a version number to identify the deployed version of your application in Datadog
      sessionSampleRate: 100,
      traceSampleRate: 0,
      trackUserInteractions: true,
      defaultPrivacyLevel: 'allow' as any,
      env: Config.environment,
      allowedTracingUrls: [/https:\/\/.*\.hopara\.app/],
      trackResources: true,
      beforeSend: (event) => {
        return shouldSend(event)
      },
    }
    datadogRum.init(config)
  }

  if (shouldRun && isProd) datadogRum.startSessionReplayRecording()
}

export const notifyError = (error: Error, context?: object) => {
  datadogRum.addError(error, context)
}
