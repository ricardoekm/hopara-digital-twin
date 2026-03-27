import React from 'react'
import {Slider} from '@hopara/design-system/src/form'
import {LineEncoding} from '@hopara/encoding'
import {i18n} from '@hopara/i18n'
import {PanelGroup} from '@hopara/design-system/src/panel/PanelGroup'
import {PureComponent} from '@hopara/design-system'

export interface StateProps {
  encoding: LineEncoding;
  layerId: string
  enabled: boolean
}

export interface ActionProps {
  onChange: (encoding: LineEncoding) => void;
  onEnabledChange: (enabled: boolean) => void;
}

type Props = StateProps & ActionProps

export class LineEditor extends PureComponent<Props> {
  handleWeightChange(event: any) {
    if (event.target?.value !== undefined) {
      return this.props.onChange(new LineEncoding({
        ...this.props.encoding,
        segmentLength: event.target.value,
      }))
    }
  }

  render() {
    return (
      <PanelGroup
        title={i18n('DASHED')}
        inline
        secondaryAction={
          <Slider
            min={0}
            max={1000}
            step={100}
            value={Number(this.props.encoding.segmentLength)}
            onChange={this.handleWeightChange.bind(this)}
            valueLabelDisplay="auto"
          />
        }
      />
    )
  }
}

