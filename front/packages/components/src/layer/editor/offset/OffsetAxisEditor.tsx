import React from 'react'
import {SizeUnits} from '@hopara/encoding/src/size/SizeEncoding'
import {Slider} from '@hopara/design-system/src/form'
import {i18n} from '@hopara/i18n'
import {PanelField} from '@hopara/design-system/src/panel/PanelField'
import { PureComponent } from '@hopara/design-system'
import { OffsetAxisEncoding } from '@hopara/encoding/src/offset/OffsetEncoding'

interface Props {
  encoding?: OffsetAxisEncoding;
  onChange: (encoding: OffsetAxisEncoding) => void
  title: string
  canBeEnabled?: boolean
  enabled?: boolean
  onEnabledChange?: (enabled: boolean) => void
  units: SizeUnits
  zoom: number
  multiplier: number
}

class OffsetAxisEditor extends PureComponent<Props> {
  getValue(): number {
    return Math.round(this.props.encoding?.getPixelValue(this.props.zoom) ?? 0)
  }

  handleValueChange(event: any) {
    return this.props.onChange(new OffsetAxisEncoding({
      value: event.target.value / this.props.multiplier,
      referenceZoom: this.props.zoom,
    }))
  }

  render() {
    return (
      <PanelField
        layout="inline"
        title={this.props.title ?? i18n('SIZE')}
      >
        <Slider
          value={this.getValue()}
          onChange={this.handleValueChange.bind(this)}
          min={-100}
          max={100}
          step={1}
          valueLabelDisplay="auto"/>
      </PanelField>
    )
  }
}

export default OffsetAxisEditor
