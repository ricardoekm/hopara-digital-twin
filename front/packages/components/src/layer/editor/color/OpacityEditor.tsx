import {Slider} from '@hopara/design-system/src/form'
import React from 'react'
import {SxProps} from '@mui/material'
import {PureComponent} from '@hopara/design-system'
import {i18n} from '@hopara/i18n'
import {PanelField} from '@hopara/design-system/src/panel/PanelField'

interface Props {
  onOpacityChange: (opacity: number) => void
  opacity: number
  sx?: SxProps
}

export class OpacityEditor extends PureComponent<Props> {
  handleOpacityChange(event: any) {
    this.props.onOpacityChange(Number(event.target.value))
  }

  render() {
    return (
      <PanelField
        layout="inline"
        title={i18n('OPACITY')}
      >
        <Slider
          min={0}
          max={1}
          step={0.01}
          value={this.props.opacity}
          onChange={this.handleOpacityChange.bind(this)}
          valueLabelDisplay="auto"
          sx={this.props.sx}
        />
      </PanelField>
    )
  }
}
