import React from 'react'
import { PureComponent } from '@hopara/design-system'
import {BrowserWarningProps, BrowserWarningComponent} from '@hopara/design-system/src/warning/BrowserWarningComponent'
import { LayerHelper, LayerHelperProps } from './LayerHelperComponent'

export type CanvasHelperProps = LayerHelperProps & BrowserWarningProps & {
  helperLayerId?: string
  isOnSettings: boolean
}

export type CanvasHelperActions = {
  onHelperDismissed: (layerId: string) => void
  onHelperLoaded: (layerId: string) => void
}

export class CanvasHelperComponent extends PureComponent<CanvasHelperProps & CanvasHelperActions> {
  render() {
    const hasBrowserWarning = !(this.props.isBrowserSupported && this.props.isWebGLSupported && this.props.isWebGLEnabled)
    if (hasBrowserWarning) {
      return (
        <BrowserWarningComponent className={this.props.visible ? 'visible' : 'hidden'}
          isBrowserSupported={this.props.isBrowserSupported}
          isWebGLSupported={this.props.isWebGLSupported}
          isWebGLEnabled={this.props.isWebGLEnabled} />
      )
    }

    if (this.props.helperText && this.props.helperLayerId) {
      return (
        <LayerHelper
          key={this.props.helperLayerId}
          helperText={this.props.helperText}
          helperLayerId={this.props.helperLayerId}
          isOnPreview={this.props.isOnSettings}
          onDismiss={(layerId) => this.props.onHelperDismissed(layerId)}
          onLoad={(layerId) => this.props.onHelperLoaded(layerId)} />
      )
    }

    return null
  }
}
