import {WebGLState, PlatformState, WebGLStatus, Device, getLanguage, Language, isPortuguese, getPlatformState, DEFAULT_TEXTURE_SIZE} from '@hopara/browser'
import { i18nLocale } from '@hopara/i18n'
import dayjs from 'dayjs'

export class BrowserStore {
  platform: PlatformState
  webGL: WebGLState
  device?: Device
  language: Language

  constructor(platform?: PlatformState, webGL?: WebGLState, device?: Device, language?: Language) {
    this.device = device
    this.webGL = webGL ?? {maxTextureSize: DEFAULT_TEXTURE_SIZE}
    this.platform = platform ?? getPlatformState()
    this.language = language ?? getLanguage()
    this.setLocales()
  }

  clone() {
    return new BrowserStore(this.platform, this.webGL, this.device)
  }

  isWebGLEnabled() {
    return this.webGL?.status === WebGLStatus.ENABLED
  }

  isWebGLSupported() {
    return this.webGL?.status !== WebGLStatus.UNSUPPORDED
  }

  isMobile() {
    return this.device?.type === 'mobile' || this.device?.type === 'tablet'
  }

  setLanguage(language: string) {
    const cloned = this.clone()
    cloned.language = isPortuguese(language) ? Language.PT_BR : Language.EN
    cloned.setLocales()
    return cloned
  }

  private setLocales() {
    dayjs.locale(this.language)
    i18nLocale(this.language)
  }
}
