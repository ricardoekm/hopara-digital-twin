import {i18n} from '@hopara/i18n'
import {Slider} from '@hopara/design-system/src'
import {ZoomJump} from '../Action'
import React from 'react'
import { PureComponent } from '@hopara/design-system'
import { PanelGroup } from '@hopara/design-system/src/panel/PanelGroup'
import { PanelField } from '@hopara/design-system/src/panel/PanelField'

interface Props {
  action: ZoomJump
  minZoom: number
  maxZoom: number
  zoom: number
  onChange: (action: ZoomJump) => void
}

export class ZoomJumpEditor extends PureComponent<Props> {
  render() {
    const action = this.props.action
    return <PanelGroup>
      <PanelField title={i18n('ZOOM')} layout="inline">
        <Slider
          min={this.props.minZoom}
          max={this.props.maxZoom}
          indicator={this.props.zoom}
          step={0.5}
          value={action.zoom?.value ?? 0}
          onChange={(event) => this.props.onChange(new ZoomJump({
            ...action,
            zoom: {
              ...action.zoom,
              value: (event.target as any).value,
            },
          }))}
          valueLabelDisplay="auto"
        />
      </PanelField>
    </PanelGroup>
  }
}
