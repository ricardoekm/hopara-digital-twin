import {ClusterTransform} from '../../../transform/ClusterTransform'
import {PanelField} from '@hopara/design-system/src/panel/PanelField'
import {i18n} from '@hopara/i18n'
import {Slider} from '@hopara/design-system/src'
import React from 'react'
import { PureComponent } from '@hopara/design-system'

interface Props {
  cluster?: ClusterTransform
  onChange: (cluster: ClusterTransform) => void
}

export class ClusterEditor extends PureComponent<Props> {
  render() {
    const labelDisplay = this.props.cluster?.radius + ' pixels'
    return (<PanelField title={i18n('AGGREGATION_RADIUS')} layout="inline">
      <Slider
        min={0}
        max={100}
        value={(this.props.cluster ?? new ClusterTransform()).radius}
        onChange={(event: any) => {
          this.props.onChange(new ClusterTransform(event.target?.value))
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
