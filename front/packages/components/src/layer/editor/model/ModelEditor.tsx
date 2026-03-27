import {SelectOption, TextField} from '@hopara/design-system/src/form'
import {PanelField} from '@hopara/design-system/src/panel/PanelField'
import {PanelGroup} from '@hopara/design-system/src/panel/PanelGroup'
import {ModelEncoding} from '@hopara/encoding'
import {i18n} from '@hopara/i18n'
import Case from 'case'
import React from 'react'
import { PureComponent } from '@hopara/design-system'
import FieldEditor from '../field/FieldEditor'
import { Columns } from '@hopara/dataset'

export interface StateProps {
  encoding?: ModelEncoding;
  fieldOptions: SelectOption[]
  layerId: string
  layerQueryColumns?: Columns
}

export interface ActionProps {
  onChange: (encoding: ModelEncoding) => void
  onPreview: (encoding: ModelEncoding) => void
}

type Props = StateProps & ActionProps

const FixedComponent = (props: Props): React.ReactElement => {
  return <>
    <PanelField
      layout="inline"
    >
      <TextField
        onChange={(event) => props.onChange(new ModelEncoding({
          ...props.encoding,
          value: event.target.value,
        }))}
        value={props.encoding?.value}
      />
    </PanelField>
  </>
}

export class ModelEditor extends PureComponent<Props> {
  handleFieldChange(field: any) {
    this.props.onChange(new ModelEncoding({
      ...this.props.encoding,
      field,
      value: field ? undefined : '',
    }))
  }

  render() {
    return (
      <PanelGroup
        title={i18n('MODEL_KEY')}
        helperText={i18n('MODEL_KEY_HELPER')}
        inline
        secondaryAction={
          <FieldEditor
            options={this.props.fieldOptions}
            columns={this.props.layerQueryColumns}
            field={this.props.encoding?.field}
            includeNullOption={true}
            nullOptionLabel={Case.sentence(i18n('FIXED'))}
            onChange={this.handleFieldChange.bind(this)}
          />
        }
      >
        {!this.props.encoding?.field && <FixedComponent {...this.props} />}
      </PanelGroup>)
  }
}

