import React from 'react'
import { PureComponent } from '@hopara/design-system'
import OffsetAxisEditor from './OffsetAxisEditor'
import {i18n} from '@hopara/i18n'
import {OffsetEncoding} from '@hopara/encoding/src/offset/OffsetEncoding'
import {Select, SelectOption} from '@hopara/design-system/src'
import { SizeUnits } from '@hopara/encoding/src/size/SizeEncoding'
import { Anchor } from '@hopara/spatial'
import { PanelField } from '@hopara/design-system/src/panel/PanelField'

export interface StateProps {
  layerId: string
  zoom: number
  offsetEncoding?: OffsetEncoding,
  units: SizeUnits
  maxResizeZoom?: number
  multiplier: number
  supportsAnchor: boolean
  isChildLayer: boolean
}

export interface ActionProps {
  onChange: (encoding: Partial<OffsetEncoding>) => void
}

type Props = StateProps & ActionProps

export class OffsetEditor extends PureComponent<Props> {
  getAnchorOptions(): SelectOption[] {
    return [
      {value: Anchor.CENTROID, label: i18n('ANCHOR_CENTROID')},
      {value: Anchor.TOP_CENTER, label: i18n('ANCHOR_TOP_CENTER')},
      {value: Anchor.BOTTOM_CENTER, label: i18n('ANCHOR_BOTTOM_CENTER')},
      {value: Anchor.LEFT_CENTER, label: i18n('ANCHOR_LEFT_CENTER')},
      {value: Anchor.RIGHT_CENTER, label: i18n('ANCHOR_RIGHT_CENTER')},
    ]
  }

  handleAnchorChange(e: { target: { value: any } }) {
    this.props.onChange({anchor: e.target.value as Anchor})
  }

  render() {
    const { isChildLayer, supportsAnchor } = this.props

    return <>
      {supportsAnchor &&
        <PanelField
          layout="inline"
          title={i18n('ANCHOR')}
        >
          <Select
            key="anchorSelect"
            value={this.props.offsetEncoding?.anchor ?? Anchor.CENTROID}
            options={this.getAnchorOptions()}
            onChange={this.handleAnchorChange.bind(this)}
            testId="select-anchor"
          />
        </PanelField>
      }
      <OffsetAxisEditor
        title={isChildLayer ? i18n('HORIZONTAL') : i18n('OFFSET_X')}
        encoding={this.props.offsetEncoding?.x!}
        onChange={(newEncoding) => {
          this.props.onChange({x: newEncoding})
        }}
        zoom={this.props.zoom}
        units={this.props.units}
        multiplier={this.props.multiplier}
      />
      <OffsetAxisEditor
        title={isChildLayer ? i18n('VERTICAL') : i18n('OFFSET_Y')}
        encoding={this.props.offsetEncoding?.y!}
        onChange={(newEncoding) => {
          this.props.onChange({y: newEncoding})
        }}
        zoom={this.props.zoom}
        units={this.props.units}
        multiplier={this.props.multiplier}
      />
    </>
  }
}
