import {i18n} from '@hopara/i18n'
import {Select, SelectOption} from '@hopara/design-system/src'
import {VisualizationJump} from '../Action'
import FieldEditor from '../../layer/editor/field/FieldEditor'
import React from 'react'
import { PureComponent } from '@hopara/design-system'
import { PanelField } from '@hopara/design-system/src/panel/PanelField'
import {PanelGroup} from '@hopara/design-system/src/panel/PanelGroup'
import { Columns } from '@hopara/dataset'

interface Props {
  action: VisualizationJump
  visualizationOptions: SelectOption[]
  onChange: (action: VisualizationJump) => void
  visualizationChanged: (visualization: string) => void
  fieldOptions: SelectOption[]
  filterOptions: SelectOption[]
  filterStatus: 'loading' | 'idle' | 'error'
  showFilter: boolean
  visualizationQueryColumns?: Columns
}

export const DisabledSelect: React.FC<{ title: string, placeholder: string, helperText?: string }> = (props) => {
  return <PanelField
    layout="inline"
    title={props.title}
    helperText={props.helperText}
  >
    <Select
      options={[]}
      value={undefined}
      placeholder={props.placeholder}
      onChange={() => undefined}
      disabled
    />
  </PanelField>
}

export class VisualizationJumpEditor extends PureComponent<Props> {
  render() {
    const action = this.props.action
    const hasFilters = !!this.props.filterOptions.length
    const hasFields = !!this.props.fieldOptions.length
    const hasVisualization = !!action.visualization

    return <PanelGroup>
      <PanelField title={i18n('VISUALIZATION')} layout="inline">
        <Select
          options={this.props.visualizationOptions}
          value={action.visualization ?? ''}
          onChange={(event) => {
            this.props.visualizationChanged(event.target.value)
            this.props.onChange(new VisualizationJump({
              ...action,
              visualization: event.target.value,
            }))
          }}
        />
      </PanelField>

      {this.props.showFilter && <>
        {!hasVisualization && <>
          <DisabledSelect
            helperText={i18n('FILTER_HELPER_TEXT')}
            title={i18n('FILTER')}
            placeholder={i18n('SELECT_A_VISUALIZATION_FIRST')}
          />
          <DisabledSelect
            title={i18n('VALUE')}
            placeholder={i18n('SELECT_A_VISUALIZATION_FIRST')}
          />
        </>
        }

        {this.props.filterStatus === 'loading' && <>
          <DisabledSelect
            helperText={i18n('FILTER_HELPER_TEXT')}
            title={i18n('FILTER')}
            placeholder={i18n('LOADING_ELLIPSIS')}
          />
          <DisabledSelect
            title={i18n('VALUE')}
            placeholder={i18n('LOADING_ELLIPSIS')}
          />
        </>}

        {hasVisualization && this.props.filterStatus === 'idle' &&
          <>
            <FieldEditor
              title={i18n('FILTER')}
              helperText={i18n('FILTER_HELPER_TEXT')}
              options={this.props.filterOptions}
              onChange={(targetField) => {
                const filter = targetField ? {
                  ...(action.filters?.[0] ?? {}),
                  targetField,
                } : undefined

                this.props.onChange(new VisualizationJump({
                  ...action,
                  filters: filter ? [filter] : undefined,
                }))
              }}
              includeNullOption={!hasFilters}
              nullOptionLabel={hasFilters ? i18n('SELECT_ELLIPSIS') : i18n('NO_FIELDS_AVAILABLE')}
              field={action?.filters?.[0]?.targetField}
              columns={this.props.visualizationQueryColumns}
              disabled={!hasFilters}
              hideUseField
            />
            <FieldEditor
              options={this.props.fieldOptions}
              onChange={(field) => {
                const filter = field ? {
                  ...(action.filters?.[0] ?? {}),
                  field,
                } : undefined

                this.props.onChange(new VisualizationJump({
                  ...action,
                  filters: filter ? [filter] : undefined,
                }))
              }}
              field={action?.filters?.[0]?.field}
              columns={this.props.visualizationQueryColumns}
              title={i18n('VALUE')}
              includeNullOption={!hasFields}
              nullOptionLabel={hasFields ? i18n('SELECT_ELLIPSIS') : i18n('NO_FIELDS_AVAILABLE')}
              disabled={!hasFields}
            />
          </>
        }</>}
    </PanelGroup>
  }
}
