import React from 'react'
import {Select, SelectOption, Slider} from '@hopara/design-system/src/form'
import {TextEncoding} from '@hopara/encoding'
import {Alignment, MaxLengthType} from '@hopara/encoding/src/text/TextEncoding'
import {i18n} from '@hopara/i18n'
import {PanelGroup} from '@hopara/design-system/src/panel/PanelGroup'
import {PanelField} from '@hopara/design-system/src/panel/PanelField'
import {PureComponent} from '@hopara/design-system'
import {Layer} from '../../Layer'
import {PrefixSuffixEditor} from './PrefixSuffixEditor'
import {Columns} from '@hopara/dataset'
import {ToggleButton, ToggleButtonGroup} from '@mui/material'
import {Icon} from '@hopara/design-system/src/icons/Icon'
import Case from 'case'

export interface StateProps {
  encoding: TextEncoding;
  fieldOptions: SelectOption[]
  resizeOn: boolean
  layer: Layer
  layerQueryColumns?: Columns
  isCoordinatesBased: boolean
}

export interface ActionProps {
  onChange: (encoding: TextEncoding) => void;
}

type Props = StateProps & ActionProps

export class TextFormatEditor extends PureComponent<Props> {
  handleFieldChange(value: any) {
    return this.props.onChange(new TextEncoding({
      ...this.props.encoding,
      field: value,
    }))
  }

  handleWeightChange(event: any) {
    if (event.target?.value !== undefined) {
      return this.props.onChange(new TextEncoding({
        ...this.props.encoding,
        weight: event.target.value,
      }))
    }
  }

  handleMaxLengthChange(event: any) {
    if (event.target?.value !== undefined) {
      return this.props.onChange(new TextEncoding({
        ...this.props.encoding,
        maxLength: {
          ...this.props.encoding.maxLength,
          value: event.target.value,
        },
      }))
    }
  }

  handleMaxLengthTypeChange(event: any) {
    if (event.target?.value !== undefined) {
      return this.props.onChange(new TextEncoding({
        ...this.props.encoding,
        maxLength: {
          ...this.props.encoding.maxLength,
          value: this.props.encoding.getMaxLength() ?? 0,
          type: event.target.value,
        } as any,
      }))
    }
  }

  handleAlignmentChange(align?: Alignment) {
    if (align !== undefined) {
      return this.props.onChange(new TextEncoding({
        ...this.props.encoding,
        align,
      }))
    }
  }

  getField(): string | undefined {
    return this.props.encoding.field
  }

  getMaxLenghtOption() {
    const maxLenghtOptions = [MaxLengthType.NONE, MaxLengthType.FIXED]
    if (this.props.resizeOn && this.props.isCoordinatesBased) {
      maxLenghtOptions.push(MaxLengthType.AUTO)
    }
    return maxLenghtOptions
  }

  render() {
    return (<>
        <PanelGroup>
          <PanelField
            layout="inline"
            title={i18n('ALIGN')}
          >
            <ToggleButtonGroup
              size="small"
              value={this.props.encoding.align ?? Alignment.CENTER}
              exclusive
              onChange={(event, newvalue: Alignment) => {
                this.handleAlignmentChange(newvalue)
              }}
            >
              <ToggleButton value={Alignment.LEFT}>
                <Icon icon="align-left" size="sm"/>
              </ToggleButton>
              <ToggleButton value={Alignment.CENTER}>
                <Icon icon="align-center" size="sm"/>
              </ToggleButton>
              <ToggleButton value={Alignment.RIGHT}>
                <Icon icon="align-right" size="sm"/>
              </ToggleButton>
            </ToggleButtonGroup>


          </PanelField>

          <PanelField
            layout="inline"
            title={i18n('WEIGHT')}
          >
            <Slider
              min={100}
              max={900}
              step={100}
              value={Number(this.props.encoding.getWeight() ?? 400)}
              onChange={this.handleWeightChange.bind(this)}
              valueLabelDisplay="auto"/>
          </PanelField>
        </PanelGroup>

        <PanelGroup
          inline
          title={i18n('MAX_LENGTH')}
          secondaryAction={<Select
            value={this.props.encoding.maxLength?.type}
            onChange={this.handleMaxLengthTypeChange.bind(this)}
            options={Object.values(this.getMaxLenghtOption()).map((type) => ({value: type, label: Case.sentence(type)}))}
          />}
        >
          {this.props.encoding.maxLength?.type === MaxLengthType.FIXED && <PanelField
            layout="inline"
            title={i18n('VALUE')}
          >
            <Slider
              min={0}
              max={100}
              step={1}
              value={Number(this.props.encoding.getMaxLength() ?? 0)}
              onChange={this.handleMaxLengthChange.bind(this)}
              valueLabelDisplay="auto"/>
          </PanelField>}
        </PanelGroup>

        <PrefixSuffixEditor
          type="prefix"
          queryColumns={this.props.layerQueryColumns}
          encoding={this.props.encoding}
          onChange={this.props.onChange}
          fieldOptions={this.props.fieldOptions}
        />

        <PrefixSuffixEditor
          type="suffix"
          queryColumns={this.props.layerQueryColumns}
          encoding={this.props.encoding}
          onChange={this.props.onChange}
          fieldOptions={this.props.fieldOptions}
        />
      </>
    )
  }
}

