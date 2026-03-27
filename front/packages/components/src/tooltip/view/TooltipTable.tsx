import React from 'react'
import {isNil} from 'lodash/fp'
import {
  TooltipField,
  TooltipHeading,
  TooltipRow,
  TooltipTableView,
} from './TooltipView'
import { PureComponent } from '@hopara/design-system'
import { getRgbaStyle } from '@hopara/design-system/src/details/RgbaStyle'

export type TooltipLine = {
  title: string
  value: string
}

type props = {
  lines: TooltipLine[]
}

export class TooltipTable extends PureComponent<props> {
  renderTableLine(key, line) {
    return (
      <TooltipRow key={key}>
        <TooltipHeading>{line.title}</TooltipHeading>
        <TooltipField style={{color: getRgbaStyle(line.color)}}>{line.value}</TooltipField>
      </TooltipRow>
    )
  }

  render() {
    // remove action from render but use for auto trigger
    const lineKeys = Object.keys(this.props.lines).filter((key) => this.props.lines[key].type !== 'action')
    if (!lineKeys.length) return null
    return (
      <TooltipTableView>
        <tbody>
        {lineKeys.map((key) => {
          const line = this.props.lines[key]
          if (line['title'] && !isNil(line['value'])) return this.renderTableLine(key, line)
          return null
        })}
        </tbody>
      </TooltipTableView>
    )
  }
}

