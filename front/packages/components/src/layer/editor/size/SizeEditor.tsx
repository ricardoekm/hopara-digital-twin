import React from 'react'
import {SizeEncoding, SizeUnits} from '@hopara/encoding/src/size/SizeEncoding'
import {SelectOption, Slider} from '@hopara/design-system/src/form'
import {ThumbFormat} from '@hopara/design-system/src/form/Slider'
import {PanelGroup} from '@hopara/design-system/src/panel/PanelGroup'
import FieldEditor from '../field/FieldEditor'
import {Switch} from '@mui/material'
import {Range} from '@hopara/spatial'
import {i18n} from '@hopara/i18n'
import Case from 'case'
import {PanelField} from '@hopara/design-system/src/panel/PanelField'
import { Columns } from '@hopara/dataset'
import { BaseSizeEditor, BaseStateProps } from './BaseSizeEditor'

export interface StateProps extends BaseStateProps {
  fieldOptions: SelectOption[]
  title?: string
  maxSize?: number
  range?: Range
  canBeEnabled?: boolean
  enabled?: boolean
  showResizeOption?: boolean
  disableRange: boolean
  layerId: string
  minSize?: number
  units: SizeUnits
  layerQueryColumns?: Columns
  allowFixed?: boolean
  allowOverride: boolean
}

export interface ActionProps {
  onChange: (encoding: SizeEncoding) => void
  onResizeChange?: (enabled: boolean) => void
  onEnabledChange?: (enabled: boolean) => void
}

type Props = StateProps & ActionProps

class SizeEditor extends BaseSizeEditor<Props> {
  isFixedSize(): boolean {
    return !this.props.encoding?.field || this.props.encoding?.isManaged()
  }

  isSwitchingFromFixed(field: any) {
    return field && !this.props.range
  }

  handleFieldChange(field: any) {
    if (this.isSwitchingFromFixed(field)) {
      const range = this.getMaxSize() - this.getMinSize()
      const delta = range / 4
      this.props.onChange(new SizeEncoding({
        ...this.props.encoding,
        referenceZoom: this.props.zoom,
        scale: {
          range: [this.getMinSize() + delta, this.getMaxSize() - delta],
        },
        field,
      }))
    } else {
      this.props.onChange(new SizeEncoding({
        ...this.props.encoding,
        referenceZoom: this.props.zoom,
        field,
      }))
    }
  }

  handleValueChange(event: any) {
    const value = Number(event.target.value) / this.props.encoding.getMultiplier()
    return this.props.onChange(new SizeEncoding({
      ...this.props.encoding,
      referenceZoom: this.props.zoom,
      value: Number(value),
    }))
  }

  handleToggleResizeChange(_, shouldResize: boolean) {
    return this.props.onResizeChange && this.props.onResizeChange(shouldResize)
  }

  handleRangeChange(event: any) {
    const minValue = event.target.value[0] / this.props.encoding.getMultiplier()
    const maxValue = event.target.value[1] / this.props.encoding.getMultiplier()

    return this.props.onChange(new SizeEncoding({
      ...this.props.encoding,
      scale: {
        range: [minValue, maxValue],
      },
    }))
  }

  handleOverrideChange() {
    return this.props.onChange(new SizeEncoding({
      ...this.props.encoding,
      field: this.props.encoding.isManaged() ? null : undefined,
    }))
  }

  canOverride() {
    return this.props.allowOverride && (!this.props.encoding?.field || this.props.encoding?.isManaged())
  }

  renderFixedSize(): React.ReactElement {
    return (<>
        <PanelField
          layout="inline"
          title={i18n('VALUE')}
        >
          <Slider
            value={this.getPixelsValue()}
            onChange={this.handleValueChange.bind(this)}
            min={this.props.range?.min ?? this.getMinSize()}
            max={this.props.range?.max ?? this.getMaxSize()}
            step={this.getStepSize()}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => value.toFixed(0)} />
        </PanelField>

        {this.props.showResizeOption && (
          <PanelField
            layout="inline"
            helperText={i18n('RESIZE_WHILE_ZOOMING')}
            title={i18n('RESIZE')}
          >
            <Switch
              size="small"
              onChange={this.handleToggleResizeChange.bind(this)}
              checked={this.props.units === SizeUnits.COMMON}
            />
          </PanelField>)}

          {this.canOverride() &&
            <PanelField
              layout="inline"
              helperText={i18n('ALLOW_SIZE_OVERRIDE_HELPER')}
              title={i18n('ALLOW_OVERRIDE')}
            >
              <Switch
                size="small"
                onChange={this.handleOverrideChange.bind(this)}
                checked={this.props.encoding.isManaged()}
              />
            </PanelField>
          }
      </>
    )
  }

  renderRangedField(): React.ReactElement {
    return (
      <>
        <PanelField
          title={i18n('RANGE')}
          helperText={i18n('RANGE_HELPER')}
        >
          <Slider
            min={this.getMinSize()}
            max={this.getMaxSize()}
            step={this.getStepSize()}
            thumbFormats={[ThumbFormat.RECTANGLE, ThumbFormat.RECTANGLE]}
            value={[
              this.props.encoding?.scale?.range[0] ?? this.getMinSize(),
              this.props.encoding?.scale?.range[1] ?? this.getMaxSize(),
            ]}
            onChange={this.handleRangeChange.bind(this)}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => value.toFixed(1)} />
        </PanelField>

        <PanelField
          title={i18n('FALLBACK')}
          helperText={i18n('FALLBACK_SIZE_HELPER')}
        >
          <Slider
            min={this.getMinSize()}
            max={this.getMaxSize()}
            value={this.getPixelsValue()}
            onChange={this.handleValueChange.bind(this)}
            valueLabelDisplay="auto"/>
        </PanelField>
      </>
    )
  }

  render() {
    return (
      <PanelGroup
        title={this.props.title ?? i18n('SIZE')}
        canBeEnabled={this.props.canBeEnabled}
        enabled={this.props.enabled}
        onEnabledChange={this.props.onEnabledChange}
        inline
        secondaryAction={
          <FieldEditor
            options={this.props.fieldOptions}
            field={this.props.encoding?.field}
            columns={this.props.layerQueryColumns}
            includeNullOption={this.props.allowFixed}
            nullOptionLabel={Case.sentence(i18n('FIXED'))}
            nullField={this.props.encoding.isManaged() ? this.props.encoding.getManagedField() : undefined}
            onChange={this.handleFieldChange.bind(this)}
          />
        }
      >
        {this.isFixedSize() && this.renderFixedSize()}
        {!this.isFixedSize() && !this.props.disableRange && this.renderRangedField()}
      </PanelGroup>)
  }
}

export default SizeEditor
