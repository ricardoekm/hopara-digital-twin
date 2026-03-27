import {Slider} from '@hopara/design-system/src/form'
import React from 'react'
import {SxProps} from '@mui/material'
import {PureComponent} from '@hopara/design-system'
import {i18n} from '@hopara/i18n'
import {PanelField} from '@hopara/design-system/src/panel/PanelField'

interface Props {
  onSaturationChange: (saturation: number) => void
  saturation: number
  sx?: SxProps
}

export class SaturationEditor extends PureComponent<Props> {
  handleChange(event: any) {
    this.props.onSaturationChange(Number(event.target.value))
  }

  render() {
    return (
      <PanelField
        layout="inline"
        title={i18n('SATURATION')}
      >
        <Slider
          min={0}
          max={1}
          step={0.01}
          value={this.props.saturation}
          onChange={this.handleChange.bind(this)}
          valueLabelDisplay="auto"
          sx={this.props.sx}
        />
      </PanelField>
    )
  }
}
