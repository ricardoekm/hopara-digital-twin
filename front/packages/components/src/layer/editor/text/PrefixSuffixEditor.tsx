import React from 'react'
import {PureComponent} from '@hopara/design-system'
import {i18n} from '@hopara/i18n'
import FieldEditor from '../field/FieldEditor'
import {PanelField} from '@hopara/design-system/src/panel/PanelField'
import {SelectOption, TextField} from '@hopara/design-system/src'
import {PanelGroup} from '@hopara/design-system/src/panel/PanelGroup'
import {TextEncoding} from '@hopara/encoding'
import { Columns } from '@hopara/dataset'

interface Props {
  type: 'prefix' | 'suffix'
  encoding?: TextEncoding
  queryColumns?: Columns
  onChange: (encoding: TextEncoding) => void
  fieldOptions: SelectOption[]
}

export class PrefixSuffixEditor extends PureComponent<Props> {
  handleValueChange(event) {
    return this.props.onChange(new TextEncoding({
      ...this.props.encoding,
      [this.props.type]: {
        value: event.target.value,
      },
    }))
  }

  handleFieldChange(field: any) {
    return this.props.onChange(new TextEncoding({
      ...this.props.encoding,
      [this.props.type]: {
        field,
      },
    }))
  }

  render() {
    return <PanelGroup
      inline
      title={this.props.type === 'prefix' ? i18n('PREFIX') : i18n('SUFFIX')}
      secondaryAction={
        <FieldEditor
          options={this.props.fieldOptions}
          columns={this.props.queryColumns}
          nullOptionLabel={i18n('FIXED')}
          field={this.props.encoding?.[this.props.type]?.field}
          onChange={this.handleFieldChange.bind(this)}
          includeNullOption
        />}
    >
      {!this.props.encoding?.[this.props.type]?.field && <PanelField
        layout="inline"
      >
        <TextField
          value={this.props.encoding?.[this.props.type]?.value}
          onChange={this.handleValueChange.bind(this)}
          placeholder={this.props.type === 'prefix' ? i18n('TYPE_THE_PREFIX') : i18n('TYPE_THE_SUFFIX')}
        />
      </PanelField>}

    </PanelGroup>
  }
}
