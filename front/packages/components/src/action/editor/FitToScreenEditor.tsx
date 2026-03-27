import {i18n} from '@hopara/i18n'
import {Slider} from '@hopara/design-system/src'
import {ZoomJump} from '../Action'
import React from 'react'
import { PureComponent } from '@hopara/design-system'
import {MAX_PADDING} from '../../zoom/translate/BoundsPadding'
import {PanelField} from '@hopara/design-system/src/panel/PanelField'
import { PanelGroup } from '@hopara/design-system/src/panel/PanelGroup'

interface Props {
  action: ZoomJump
  onChange: (action: ZoomJump) => void
}

export class FitToScreenEditor extends PureComponent<Props> {
  render() {
    return <PanelGroup>
      <PanelField
        title={i18n('PADDING')}
        layout="inline"
        helperText={i18n('PADDING_HELPER_TEXT')}
      >
        <Slider
          min={0}
          max={MAX_PADDING}
          valueLabelDisplay={'auto'}
          valueLabelFormat={(value) => `${value}%`}
          value={this.props.action.zoom?.padding ?? 0}
          onChange={(event, value) => {
            this.props.onChange({
              ...this.props.action,
              zoom: {
                ...this.props.action.zoom,
                padding: value as number,
              },
            })
          }}
        />
      </PanelField>
    </PanelGroup>
  }
}
