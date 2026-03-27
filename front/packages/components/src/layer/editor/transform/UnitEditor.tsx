import React from 'react'
import { PureComponent } from '@hopara/design-system'
import {UnitTransform} from '../../../transform/UnitTransform'
import {Select, SelectOption, Slider} from '@hopara/design-system/src'
import FieldEditor from '../field/FieldEditor'
import {i18n} from '@hopara/i18n'
import {PanelField} from '@hopara/design-system/src/panel/PanelField'
import {PanelGroup} from '@hopara/design-system/src/panel/PanelGroup'
import { Columns } from '@hopara/dataset'

interface Props {
  unit?: UnitTransform
  queryColumns?: Columns
  onChange: (unit: UnitTransform) => void
  options: SelectOption[]
}

export class UnitEditor extends PureComponent<Props> {
  render() {
    const unit = this.props?.unit ?? new UnitTransform()
    return <PanelGroup>
      <FieldEditor
        layout="inline"
        columns={this.props.queryColumns}
        title={i18n('GROUP_BY')}
        options={this.props.options}
        onChange={(field: string) => {
          this.props.onChange(unit.immutableSetGroupBy(field))
        }}
        field={unit.group?.field}
      />
      {unit.group?.field && <PanelField title={i18n('GROUP_LIMIT')} layout="inline">
        <Slider
          min={0}
          max={50}
          step={1}
          value={unit.group?.limit}
          onChange={(event: any) => {
            this.props.onChange(unit.immutableSetGroupLimit(event.target?.value))
          }}
          valueLabelDisplay="auto"
        />
      </PanelField>
      }
      <FieldEditor
        layout="inline"
        columns={this.props.queryColumns}
        title={i18n('SORT_BY')}
        options={this.props.options}
        onChange={(field: string) => {
          this.props.onChange(unit.immutableSetSortBy(field))
        }}
        field={unit.sort?.field}
      />
      {unit.sort?.field && <PanelField title={i18n('SORT_ORDER')} layout="inline">
        <Select
          options={[
            {label: i18n('ASCENDING'), value: 'ASC'},
            {label: i18n('DESCENDING'), value: 'DESC'},
          ]}
          onChange={(event: any) => {
            this.props.onChange(unit.immutableSetSortOrder(event.target?.value))
          }}
          value={unit.sort?.order}
        />
      </PanelField>}
    </PanelGroup>
  }
}
