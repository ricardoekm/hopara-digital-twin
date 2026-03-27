import React from 'react'
import {PureComponent} from '../component/PureComponent'
import {i18n} from '@hopara/i18n'
import {HelperComponent} from '../helper/HelperComponent'

export interface BrowserWarningProps {
  inline?: boolean
  isBrowserSupported: boolean
  isWebGLSupported: boolean
  isWebGLEnabled: boolean
  className?: string
}

export class BrowserWarningComponent extends PureComponent<BrowserWarningProps> {
  render() {
    const { isBrowserSupported, isWebGLSupported, isWebGLEnabled, inline, className } = this.props
    
    const warningProps = {
      icon: 'warning' as const,
      inline,
      className,
    }

    if (!isBrowserSupported) {
      return <HelperComponent {...warningProps}>
        {i18n('BROWSER_UNSUPPORTED')}
      </HelperComponent>
    }
    
    if (!isWebGLSupported) {
      return <HelperComponent {...warningProps}>
        {i18n('WEBGL_UNSUPPORTED')}
      </HelperComponent>
    }
    
    if (!isWebGLEnabled) {
      return <HelperComponent {...warningProps}>
        {i18n('WEBGL_DISABLED')}
      </HelperComponent>
    }
    
    return null
  }
}
