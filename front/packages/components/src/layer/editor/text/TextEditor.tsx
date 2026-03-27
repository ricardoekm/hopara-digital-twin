import React from 'react'
import {SelectOption, TextField} from '@hopara/design-system/src/form'
import {TextEncoding} from '@hopara/encoding'
import FieldEditor from '../field/FieldEditor'
import {i18n} from '@hopara/i18n'
import {PanelGroup} from '@hopara/design-system/src/panel/PanelGroup'
import {PureComponent} from '@hopara/design-system'
import {Columns} from '@hopara/dataset'
import {PanelField} from '@hopara/design-system/src/panel/PanelField'

export interface StateProps {
  encoding: TextEncoding;
  fieldOptions: SelectOption[]
  layerQueryColumns?: Columns
  layerId: string
}

export interface ActionProps {
  onChange: (encoding: TextEncoding) => void;
}

type Props = StateProps & ActionProps

export class TextEditor extends PureComponent<Props> {
  handleFieldChange(value: any) {
    return this.props.onChange(new TextEncoding({
      ...this.props.encoding,
      field: value,
      value: this.props.encoding.value ?? i18n('TEXT'),
    }))
  }

  handleValueChange(event: any) {
    return this.props.onChange(new TextEncoding({
      ...this.props.encoding,
      value: event.target.value,
    }))
  }

  getField(): string | undefined {
    return this.props.encoding.field
  }

  render() {
    return (<PanelGroup
      title={i18n('TEXT')}
      inline
      secondaryAction={
        <FieldEditor
          options={this.props.fieldOptions}
          columns={this.props.layerQueryColumns}
          field={this.getField()}
          includeNullOption={true}
          nullOptionLabel={i18n('FIXED')}
          onChange={this.handleFieldChange.bind(this)}
        />
      }>
      {!this.getField() && <PanelField
        layout="inline"
      >
        <TextField
          value={this.props.encoding.value}
          onChange={this.handleValueChange.bind(this)}
          placeholder={i18n('VALUE')}
        />
      </PanelField>}
    </PanelGroup>)
  }
}

