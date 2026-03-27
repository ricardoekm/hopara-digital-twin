import supportedBrowsers from './SupportedBrowsers'

export const isSupportedBrowser = () => {
  return supportedBrowsers.test(navigator.userAgent)
}

export interface PlatformState {
  userAgent: string
  isSupported: boolean
}

export const getPlatformState = (): PlatformState => {
  const userAgent = navigator.userAgent
  return { userAgent, isSupported: isSupportedBrowser() }
}
