import {PanelField} from '@hopara/design-system/src/panel/PanelField'
import {i18n} from '@hopara/i18n'
import {Slider} from '@hopara/design-system/src'
import React from 'react'
import { PureComponent } from '@hopara/design-system'
import { NeighborCountTransform } from '../../../transform/NeighborCountTransform'

interface Props {
  neighborCount?: NeighborCountTransform
  onChange: (neighborCount: NeighborCountTransform) => void
}

export class NeighborCountEditor extends PureComponent<Props> {
  render() {
    const labelDisplay = this.props.neighborCount?.radius + ' pixels'
    return (<PanelField title={i18n('RADIUS')} layout="inline">
      <Slider
        min={0}
        max={100}
        value={(this.props.neighborCount ?? new NeighborCountTransform()).radius}
        onChange={(event: any) => {
          this.props.onChange(new NeighborCountTransform(event.target?.value))
        }}
        valueLabelDisplay={'auto'}
        valueLabelFormat={() => {
          return (<React.Fragment>
            {labelDisplay}
          </React.Fragment>)
        }}
      />
    </PanelField>)
  }
}
