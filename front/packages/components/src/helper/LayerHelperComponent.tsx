import React from 'react'
import {PureComponent} from '@hopara/design-system'
import {HelperComponent} from '@hopara/design-system/src/helper/HelperComponent'

export interface LayerHelperProps {
  helperText?: string
  helperLayerId?: string
  isOnPreview?: boolean
  visible?: boolean
  className?: string
}

export interface LayerHelperCallbacks {
  onDismiss?: (layerId: string) => void
  onLoad?: (layerId: string) => void
}

export class LayerHelper extends PureComponent<LayerHelperProps & LayerHelperCallbacks> {
  handleDismiss(): void {
    if (this.props.onDismiss) this.props.onDismiss(this.props.helperLayerId!)
  }

  componentDidMount(): void {
    if (this.props.onLoad) this.props.onLoad(this.props.helperLayerId!)
  }

  render() {
    return <HelperComponent
      icon="helper"
      iconColor='primary.main'
      hasDismissButton
      onDismiss={this.handleDismiss.bind(this)}
    >
      {this.props.helperText}
    </HelperComponent>
  }
}
