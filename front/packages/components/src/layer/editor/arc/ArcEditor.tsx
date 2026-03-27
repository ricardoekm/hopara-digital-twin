import React from 'react'
import {SelectOption} from '@hopara/design-system/src/form'
import {PanelGroup} from '@hopara/design-system/src/panel/PanelGroup'
import FieldEditor from '../field/FieldEditor'
import {i18n} from '@hopara/i18n'
import {ArcEncoding} from '@hopara/encoding/src/arc/ArcEncoding'
import { PureComponent } from '@hopara/design-system'
import { Columns } from '@hopara/dataset'

export interface StateProps {
  encoding?: ArcEncoding;
  fieldOptions: SelectOption[]
  layerId: string;
  layerQueryColumns?: Columns
}

export interface ActionProps {
  onChange: (encoding: ArcEncoding) => void
}

type Props = StateProps & ActionProps

class ArcEditor extends PureComponent<Props> {
  notifyChange(encoding: ArcEncoding): void {
    this.props.onChange(encoding)
  }

  handleFieldChange(field: any) {
    this.notifyChange(new ArcEncoding({
      ...this.props.encoding,
      field,
    }))
  }

  render() {
    return (
      <PanelGroup
        title={i18n('PIE')}
        inline
        secondaryAction={
          <FieldEditor
            options={this.props.fieldOptions}
            field={this.props.encoding?.field}
            columns={this.props.layerQueryColumns}
            onChange={this.handleFieldChange.bind(this)}
          />
        }
      >
      </PanelGroup>)
  }
}

export default ArcEditor
