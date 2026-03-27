import React, { PropsWithChildren } from 'react'
import { Tooltip as MaterialTooltip, TooltipProps } from '@mui/material'
import { PureComponent } from '../component/PureComponent'

export class Tooltip extends PureComponent<PropsWithChildren & TooltipProps> {
  render() {
    if (window?.matchMedia && window.matchMedia('(any-hover:none)').matches) {
      return this.props.children
    }

    return <MaterialTooltip {...this.props} />
  }
}
