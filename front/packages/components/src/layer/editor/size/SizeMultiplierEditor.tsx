import React from 'react'
import {SizeMultiplierEncoding, SizeUnits} from '@hopara/encoding/src/size/SizeEncoding'
import {Slider} from '@hopara/design-system/src/form'
import {PanelGroup} from '@hopara/design-system/src/panel/PanelGroup'
import {i18n} from '@hopara/i18n'
import {PanelField} from '@hopara/design-system/src/panel/PanelField'
import {PureComponent} from '@hopara/design-system'
import {Layer} from '../../Layer'
import {Switch} from '@mui/material'

export interface StateProps {
  encoding?: SizeMultiplierEncoding;
  layer: Layer;
  units: SizeUnits;
}

export interface ActionProps {
  onChange: (encoding: SizeMultiplierEncoding) => void
  handleToggleResizeChange: (event: any, checked: boolean) => void;
}

type Props = StateProps & ActionProps

function valueLabelFormat(value: number) {
  return `${value}%`
}

export class SizeMultiplierEditor extends PureComponent<Props> {
  getMinSize() {
    return 10
  }

  getMaxSize() {
    return 300
  }

  getValue(): number {
    return Math.round((this.props.encoding?.multiplier ?? 1) * 100)
  }

  notifyChange(encoding: SizeMultiplierEncoding): void {
    this.props.onChange(encoding)
  }

  handleValueChange(event: any) {
    this.notifyChange(new SizeMultiplierEncoding({
      multiplier: Number(event.target.value) / 100,
    }))
  }

  renderMultiplierField(): React.ReactElement {
    return (<>
      <PanelField
        title={i18n('SCALE')}
        layout="inline"
      >
        <Slider
          min={this.getMinSize()}
          max={this.getMaxSize()}
          value={this.getValue()}
          step={5}
          onChange={this.handleValueChange.bind(this)}
          valueLabelDisplay="auto"
          valueLabelFormat={valueLabelFormat}
        />
      </PanelField>
      <PanelField
        layout="inline"
        helperText={i18n('RESIZE_WHILE_ZOOMING')}
        title={i18n('RESIZE')}
      >
        <Switch
          size="small"
          onChange={this.props.handleToggleResizeChange}
          checked={this.props.units === SizeUnits.COMMON}
        />
      </PanelField>
    </>)
  }

  render() {
    return (
      <PanelGroup
        title={i18n('SIZE')}
      >
        {this.renderMultiplierField()}
      </PanelGroup>
    )
  }
}

export default SizeMultiplierEditor
