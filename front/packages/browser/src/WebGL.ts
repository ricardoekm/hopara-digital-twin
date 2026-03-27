import { isMobile } from './UA'

export enum WebGLStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  UNSUPPORDED = 'unsupported',
}

export interface WebGLState {
  status?: WebGLStatus
  maxTextureSize: number
}

export const DEFAULT_TEXTURE_SIZE = 4096
export const MAX_TEXTURE_SIZE = 16383

export const getMaxtextureSize = async (sizeLimit: number = Number.MAX_SAFE_INTEGER): Promise<number> => {
  const maxTextureSize = await isMobile() ? 4096 : Math.min(sizeLimit, MAX_TEXTURE_SIZE)
  const gl = document.createElement('canvas').getContext('webgl')
  const glMaxTextureSize = gl?.getParameter(gl?.MAX_TEXTURE_SIZE) ?? DEFAULT_TEXTURE_SIZE

  const lose = gl?.getExtension('WEBGL_lose_context')  
  if (lose) lose.loseContext()

  return maxTextureSize && maxTextureSize < glMaxTextureSize ? maxTextureSize : glMaxTextureSize
}

export const getGLStatus = (): WebGLStatus => {
  try {
    const gl = document.createElement('canvas').getContext('webgl')
    if (!gl) throw new Error('Cannot get WebGL context')
    
    const lose = gl.getExtension('WEBGL_lose_context')  
    if (lose) lose.loseContext()

    return WebGLStatus.ENABLED
  } catch {
    if ('WebGLRenderingContext' in window) {
      return WebGLStatus.DISABLED
    }
    return WebGLStatus.UNSUPPORDED
  }
}

export const getGLState = async (): Promise<WebGLState> => {
  return {
    status: getGLStatus(), 
    maxTextureSize: await getMaxtextureSize(),
  }
}
