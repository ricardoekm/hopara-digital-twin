import React from 'react'
import {SelectOption} from '@hopara/design-system/src/form'
import {ColorEncoding} from '@hopara/encoding/src/color/ColorEncoding'
import {OpacityEditor} from './OpacityEditor'
import {i18n} from '@hopara/i18n'
import {sortBy} from 'lodash'
import {PanelGroup} from '@hopara/design-system/src/panel/PanelGroup'
import {PanelField} from '@hopara/design-system/src/panel/PanelField'
import {ColorPicker} from '@hopara/design-system/src/color-picker/ColorPicker'
import {ColorSchemePicker} from '@hopara/design-system/src/color-picker/ColorSchemePicker'
import FieldEditor from '../field/FieldEditor'
import Case from 'case'
import {PureComponent} from '@hopara/design-system'
import {Switch} from '@mui/material'
import {SaturationEditor} from './SaturationEditor'
import {Columns} from '@hopara/dataset'

export interface StateProps {
  title?: string
  encoding: ColorEncoding;
  previewEncoding?: ColorEncoding
  fieldOptions: SelectOption[]
  canBeEnabled?: boolean
  enabled?: boolean
  allowFixed: boolean
  allowOpacity: boolean
  allowFallback: boolean
  allowColorSelection: boolean
  allowSaturation: boolean
  allowDefault?: boolean
  testId?: string
  layerId: string
  layerQueryColumns?: Columns
  allowOverride: boolean
}

export interface ActionProps {
  onChange: (encoding: ColorEncoding) => void;
  onPreview?: (encoding: ColorEncoding | undefined) => void;
  onEnabledChange?: (enabled: boolean) => void
}

type Props = StateProps & ActionProps

class ColorEditor extends PureComponent<Props> {
  handleValueChange(value: any) {
    return this.props.onChange(new ColorEncoding({
      ...this.props.encoding,
      value,
    }))
  }

  handleValuePreview(value: any) {
    return this.props.onPreview && this.props.onPreview(value ? new ColorEncoding({
      ...this.props.encoding,
      value,
    }) : undefined)
  }

  handleReverseChange(reverse) {
    return this.props.onChange(new ColorEncoding({
      ...this.props.encoding,
      scale: {
        ...this.props.encoding.scale,
        reverse,
      },
    }))
  }

  handleFieldChange(value: string) {
    return this.props.onChange(new ColorEncoding({
      ...this.props.encoding,
      field: value,
    }))
  }

  handleSchemeChange(scheme: string | undefined) {
    return this.props.onChange(new ColorEncoding({
      ...this.props.encoding,
      scale: {
        ...this.props.encoding.scale,
        scheme,
      },
    }))
  }

  handleSchemePreview(scheme: string | undefined) {
    return this.props.onPreview && this.props.onPreview(scheme ? new ColorEncoding({
      ...this.props.encoding,
      scale: {
        ...this.props.encoding.scale,
        scheme,
      },
    }) : undefined)
  }

  handleOpacityChange(opacity: number) {
    return this.props.onChange(new ColorEncoding({
      ...this.props.encoding,
      opacity,
    }))
  }

  handleSaturationChange(saturation: number) {
    return this.props.onChange(new ColorEncoding({
      ...this.props.encoding,
      saturation,
    }))
  }

  handleOverrideChange() {
    return this.props.onChange(new ColorEncoding({
      ...this.props.encoding,
      // If undefined the default filler will set to the managed field
      // If null it will ignore
      field: this.props.encoding.isManaged() ? null : undefined,
    }))
  }

  getSelectFieldOptions() {
    return sortBy(this.props.fieldOptions, ['label'])
  }

  canOverride() {
    return this.props.allowOverride && (!this.props.encoding.field || this.props.encoding.isManaged())
  }

  render() {
    const reverse = !!this.props.encoding.getScale().reverse
    return (
      <PanelGroup
        title={this.props.allowColorSelection ? this.props.title ?? i18n('COLOR') : undefined}
        canBeEnabled={this.props.canBeEnabled}
        enabled={this.props.enabled}
        onEnabledChange={this.props.onEnabledChange}
        inline={this.props.allowColorSelection}
        testId={this.props.testId}
        secondaryAction={
          this.props.allowColorSelection &&
          <FieldEditor
            testId='select-type-color'
            inline
            options={this.getSelectFieldOptions()}
            field={this.props.encoding?.field}
            columns={this.props.layerQueryColumns}
            includeNullOption={this.props.allowFixed}
            nullOptionLabel={Case.sentence(i18n('FIXED_FEMALE'))}
            nullField={this.props.encoding.isManaged() ? this.props.encoding.getManagedField() : undefined}
            onChange={this.handleFieldChange.bind(this)}
          />
        }
      >
        {!this.props.encoding?.field && this.props.allowFixed &&
          <PanelField
            layout="inline"
          >
            <ColorPicker
              testId={this.props.testId}
              value={this.props.encoding?.value}
              previewValue={this.props.previewEncoding?.value}
              onChange={this.handleValueChange.bind(this)}
              onPreview={this.handleValuePreview.bind(this)}
            />
          </PanelField>
        }
        {this.props.allowDefault &&
          <PanelField
            layout="inline"
          >
            <ColorPicker
              value={this.props.encoding?.value}
              previewValue={this.props.previewEncoding?.value}
              onChange={this.handleValueChange.bind(this)}
              onPreview={this.handleValuePreview.bind(this)}
              testId={this.props.testId}
            />
          </PanelField>
        }
        {!this.props.allowDefault && this.props.encoding?.field &&
          <>
            <PanelField
              layout="inline"
              title={i18n('SCHEME')}
            >
              <ColorSchemePicker
                reverse={reverse}
                value={this.props.encoding.getScale().scheme}
                previewValue={this.props.previewEncoding?.getScale().scheme}
                range={this.props.encoding.getScale().colors}
                onSchemeChange={this.handleSchemeChange.bind(this)}
                onSchemePreview={this.handleSchemePreview.bind(this)}
              />
            </PanelField>
            <PanelField title={i18n('REVERSE')} layout="inline">
              <Switch
                size="small"
                checked={reverse}
                onChange={(e) => this.handleReverseChange(!!e?.target?.checked)}/>
            </PanelField>

            {this.props.allowFallback &&
              <PanelField
                layout="inline"
                title={i18n('FALLBACK')}
                helperText={i18n('FALLBACK_COLOR_HELPER')}
              >
                <ColorPicker
                  value={this.props.encoding?.value}
                  previewValue={this.props.previewEncoding?.value}
                  onChange={this.handleValueChange.bind(this)}
                  onPreview={this.handleValuePreview.bind(this)}
                />
              </PanelField>
            }
          </>
        }
        {this.props.allowOpacity && <OpacityEditor
          opacity={this.props.encoding?.opacity as number}
          onOpacityChange={this.handleOpacityChange.bind(this)}
          sx={{width: '92%'}}
        />}
        {this.props.allowSaturation && <SaturationEditor
          saturation={this.props.encoding?.saturation as number}
          onSaturationChange={this.handleSaturationChange.bind(this)}
          sx={{width: '92%'}}
        />}

        {this.canOverride() && (
          <PanelField
            layout="inline"
            helperText={i18n('ALLOW_COLOR_OVERRIDE_HELPER')}
            title={i18n('ALLOW_OVERRIDE')}
          >
            <Switch
              size="small"
              onChange={this.handleOverrideChange.bind(this)}
              checked={this.props.encoding.isManaged()}
            />
          </PanelField>)}
      </PanelGroup>
    )
  }
}

export default ColorEditor
