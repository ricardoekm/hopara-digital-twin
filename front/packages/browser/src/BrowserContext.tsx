import React, { useEffect, useState } from 'react'
import { getPlatformState, PlatformState } from './Platform'
import { getGLState, WebGLState, WebGLStatus } from './WebGL'

export const BrowserContext = React.createContext<{webgl?: WebGLState & {isEnabled: boolean, isSupported: boolean}, platform: PlatformState}>({
  platform: getPlatformState(),
})

export const BrowserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [glState, setGLState] = useState<WebGLState | null>(null)

  useEffect(() => {
    if (glState) return
    (async () => {
      setGLState(await getGLState())
    })()
  }, [])

  return (
    <BrowserContext.Provider value={{
      webgl: {
        ...glState!,
        isEnabled: glState ? glState.status === WebGLStatus.ENABLED : false,
        isSupported: glState ? glState.status !== WebGLStatus.UNSUPPORDED : false,
      },
      platform: getPlatformState()
    }}>
      {children}
    </BrowserContext.Provider>
  )
}
