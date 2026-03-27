import React from 'react'
import {Tooltip as TooltipComp} from './view/TooltipView'
import {TooltipTable as TooltipTableComp} from './view/TooltipTable'
import Tooltip from './domain/TooltipModel'
import { isEmpty } from 'lodash'
import { PureComponent } from '@hopara/design-system'
import { Config } from '@hopara/config'

export type StateProps = {
  tooltip: Tooltip
  lines: any[]
}

export default class TooltipComponent extends PureComponent<StateProps> {
  render(): React.ReactNode {
    if (isEmpty(this.props.lines) || Config.getValueAsBoolean('IS_TOUCH_DEVICE')) {
      return null
    }

    return (
      <TooltipComp coordinates={this.props.tooltip.getCoordinates()}>
        <TooltipTableComp lines={this.props.lines} />
      </TooltipComp>
    )
  }
}
