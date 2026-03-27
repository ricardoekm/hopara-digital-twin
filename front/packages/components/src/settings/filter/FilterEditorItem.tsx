import React from 'react'
import { i18n } from '@hopara/i18n'
import { ColumnType, Queries, Query } from '@hopara/dataset'
import { PanelField } from '@hopara/design-system/src/panel/PanelField'
import { TextField } from '@hopara/design-system/src/form/TextField'
import { Select } from '@hopara/design-system/src/form/Select'
import { ComparisonType, Filter } from '../../filter/domain/Filter'
import FieldEditor from '../../layer/editor/field/FieldEditor'
import { DataEditor } from '../../layer/editor/data/DataEditor'
import { Box, Switch } from '@mui/material'
import { AutoFillMode } from '../../filter/domain/AutoFill'
import FilterCodeEditor from './FilterCodeEditor'
import { getFieldOptionsFromQuery } from '../../layer/editor/field/FieldOptions'
import { DateRangePicker } from '@hopara/design-system/src/date-range/DateRangePicker'
import {PanelCard} from '@hopara/design-system/src/panel/PanelCard'
import { dateRangeOptions } from '../../filter/DateRangeFilter'
import { PureComponent } from '@hopara/design-system'

interface Props {
  selectedItem: Filter
  selectedItemQuery?: Query
  isAdvancedMode: boolean
  queries: Queries
  queryLink?: string
  newQueryLink?: string
  dataSourceLink?: string
  onChange: (filter: Filter) => void
  onChangeQuery: (query: Query) => void
  onChangeDataSource: (dataSource: string) => void
  onChangeField: (title: string) => void
  onChangeSingleChoice: (singleChoice: boolean) => void
  onChangeAutoFill: (autoFillMode: AutoFillMode | undefined) => void
  onGoToQuery: (dataSource: string, query?: string) => void
  onGoToDataSource: (dataSource?: string) => void
  onComparisonTypeChanged: (comparisonType: ComparisonType) => void
  dataSourceListLink: string
}

export class FilterEditorItem extends PureComponent<Props> {
  renderDefault(props:Props) {
    return (
      <PanelField title={i18n('TYPE')} layout="inline">
        <Select
          value={props.selectedItem.singleChoice ? 'single' : 'multiple'}
          onChange={(e) => {
            props.onChangeSingleChoice(e.target.value === 'single')
          }}
          options={[{
            value: 'single',
            label: i18n('SINGLE_CHOICE'),
          }, {
            value: 'multiple',
            label: i18n('MULTIPLE_CHOICE'),
          }]}
        />
      </PanelField>
    )
  }

  renderDefaultAutoFill(props:Props) {
    return (
      <PanelField
        layout="inline"
        title={i18n('DEFAULT_VALUE')}
        helperText={i18n('IF_THE_FILTER_VALUE_IS_NOT_SET_IT_WILL_USE_THE_FIRST_OPTION_AS_DEFAULT')}
      >
        <TextField
          value={props.selectedItem.autoFill?.values?.[0]}
          onChange={(event) => {
            const value = event.target.value
            props.onChange(new Filter({
              ...props.selectedItem,
              autoFill: {
                mode: props.selectedItem.autoFill?.mode ?? AutoFillMode.ALWAYS,
                values: value ? [value] : undefined,
              },
            }))
          }}
        />
      </PanelField>
    )
  }

  possibleComparisonTypes = [
    ComparisonType.BETWEEN,
    ComparisonType.LESS_EQUALS_THAN,
    ComparisonType.GREATER_EQUALS_THAN,
  ]

  renderDateTime(props:Props) {
    return (
      <PanelField layout="inline" title={i18n('COMPARISON_TYPE')}>
        <Select
          value={props.selectedItem.comparisonType ?? ''}
          onChange={(e) => {
            props.onComparisonTypeChanged(e.target.value)
          }}
          options={[{
            value: '',
            label: i18n('AUTO'),
          },
          ...this.possibleComparisonTypes.map((comparisonType) => {
            return {
              value: ComparisonType[comparisonType],
              label: i18n(`COMPARISON_${ComparisonType[comparisonType]}` as any),
            }
          })]}
      />
      </PanelField>
    )
   }

  renderDateTimeAutoFill(props:Props) {
    return (
      <PanelField>
        <DateRangePicker
          options={dateRangeOptions}
          values={props.selectedItem.autoFill?.values ?? []}
          onChange={(values) => {
            props.onChange(new Filter({
              ...props.selectedItem,
              autoFill: {
                mode: props.selectedItem.autoFill?.mode ?? AutoFillMode.ALWAYS,
                values: values as string[],
              },
            }))
          }}
        />
      </PanelField>
    )
  }

  render() {
    if (this.props.isAdvancedMode) {
      return (
        <FilterCodeEditor filter={this.props.selectedItem} onChange={this.props.onChange} />
      )
    }

    const autofillChecked = this.props.selectedItem.autoFill?.mode === AutoFillMode.ALWAYS
    const isDateRange = this.props.queries.getColumns(this.props.selectedItem.data.getQueryKey()).get(this.props.selectedItem.field)?.type === ColumnType.DATETIME

    return (<>
      <PanelCard title={i18n('OPTIONS')} helperText={i18n('WHERE_ARE_THE_OPTIONS_COMING_FROM')}>
        <DataEditor
          query={this.props.selectedItemQuery}
          queries={this.props.queries}
          dataSource={this.props.selectedItem.data.source}
          dataSources={this.props.queries.getDataSources()}
          queryLink={this.props.queryLink}
          newQueryLink={this.props.newQueryLink}
          dataSourceLink={this.props.dataSourceLink}
          dataSourceListLink={this.props.dataSourceListLink}
          onChange={this.props.onChangeQuery}
          onChangeDataSource={this.props.onChangeDataSource}
        />
        <PanelField layout="inline" title={i18n('FIELD')} >
          <FieldEditor
            required
            field={this.props.selectedItem.field}
            columns={this.props.queries.findQuery(this.props.selectedItem.data.getQueryKey())?.columns}
            options={getFieldOptionsFromQuery(this.props.queries, this.props.selectedItem.data.getQueryKey())}
            onChange={this.props.onChangeField}
            hideUseField
          />
        </PanelField>
      </PanelCard>

      <PanelCard title={i18n('BEHAVIOR')}>
        {!isDateRange && this.renderDefault(this.props)}
        {isDateRange && this.renderDateTime(this.props)}

        <PanelField layout="inline" title={i18n('AUTO_FILL')}>
          <Box sx={{ display: 'flex', justifyContent: 'right' }}>
            <Switch
              checked={autofillChecked}
              onChange={(event) => {
                this.props.onChangeAutoFill(event.target.checked ? AutoFillMode.ALWAYS : undefined)
              }}
            />
          </Box>
        </PanelField>
        
        {autofillChecked && !isDateRange && this.renderDateTimeAutoFill(this.props)}
        {autofillChecked && isDateRange && this.renderDateTimeAutoFill(this.props)}
      </PanelCard>
    </>)
  }
}
