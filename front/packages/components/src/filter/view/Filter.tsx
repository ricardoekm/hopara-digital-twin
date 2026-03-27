import React from 'react'
import {i18n} from '@hopara/i18n'
import {DateRangePicker} from '@hopara/design-system/src/date-range/DateRangePicker'
import {ColumnType} from '@hopara/dataset'
import {PureComponent} from '@hopara/design-system'
import {AsyncFilterableSelect} from '@hopara/design-system/src/form/AsyncFilterableSelect'
import {AsyncFilterableMultiSelect} from '@hopara/design-system/src/form/AsyncFilterableMultiSelect'
import {PanelCard} from '@hopara/design-system/src/panel/PanelCard'
import { ComparisonType } from '../domain/Filter'
import { dateRangeOptions, DateRangeValue } from '../DateRangeFilter'
// import { getCurrentLocale } from '../DateRangeFilter'
// import { DateTimePanelCardField } from '@hopara/design-system/src/date-range/DateTimePanelCardField'

type Props = {
  title: string
  options: string[]
  values: string[]
  singleChoice?: boolean
  query?: string
  queryResults?: string[]
  onSearch: (term: string | undefined) => void
  onChange: (value: string | undefined) => void
  onDateFilterChange: (values?: DateRangeValue) => void
  filterColumn?: string
  columnType?: ColumnType
  hasAutoFill: boolean
  comparisonType?: ComparisonType
}

interface RenderProps {
  placeholder: string
  noOptionsText: string
  clearLabel: string
}

export class FilterCard extends PureComponent<Props> {
  getOptions() {
    let options = this.props.options
    if (this.props.query) {
      options = this.props.queryResults ?? []
    }
    return options.map((o) => ({value: o, label: String(o)}))
  }

  renderSingleChoiceGroup(props: RenderProps) {
    return <AsyncFilterableSelect
      showClearButton="TEXT"
      clearLabel={props.clearLabel}
      placeholder={props.placeholder}
      noOptionsText={props.noOptionsText}
      value={this.props.query !== undefined ? this.props.query : this.props.values[0]}
      options={this.getOptions()}
      onChange={this.props.onChange}
      onSearch={this.props.onSearch}
      onClear={() => {
        this.props.onChange('')
        this.props.onSearch('')
      }}
    />
  }

  renderMultipleChoiceGroup(props: RenderProps) {
    return <AsyncFilterableMultiSelect
      showClearButton="TEXT"
      clearLabel={props.clearLabel}
      placeholder={props.placeholder}
      noOptionsText={props.noOptionsText}
      values={this.props.values}
      options={this.getOptions()}
      onChange={this.props.onChange}
      onSearch={this.props.onSearch}
      onClear={() => {
        this.props.onChange('')
        this.props.onSearch('')
      }}
    />
  }

  renderDateAutoGroup() {
    return <DateRangePicker
      options={dateRangeOptions}
      values={this.props.values}
      canCustomize={true}
      showInitialDate={this.props.values.length > 1}
      showFinalDate={this.props.values.length > 1}
      onChange={this.props.onDateFilterChange}
      hasAutoFill={this.props.hasAutoFill}
      showClearButton={!!this.props.values.length}
    />
  }

  renderDateRangeGroup() {
    return <DateRangePicker
      options={dateRangeOptions}
      values={this.props.values}
      showFinalDate={true}
      showInitialDate={true}
      onChange={this.props.onDateFilterChange}
      hasAutoFill={this.props.hasAutoFill}
      showClearButton={!!this.props.values.length}
    />
  }

  renderDateGroup() {
    const isFinalDate = this.props.comparisonType === ComparisonType.LESS_EQUALS_THAN

    return <DateRangePicker
      options={dateRangeOptions}
      values={this.props.values}
      showInitialDate={!isFinalDate}
      showFinalDate={isFinalDate}
      onChange={this.props.onDateFilterChange}
      hasAutoFill={this.props.hasAutoFill}
      showClearButton={!!this.props.values.length}
    />
  }

  isRangedFilter() {
    return this.props.comparisonType === ComparisonType.BETWEEN
  }

  isPartialRangeFilter() {
    return this.props.comparisonType === ComparisonType.LESS_EQUALS_THAN ||
           this.props.comparisonType === ComparisonType.GREATER_EQUALS_THAN
  }

  render() {
    if (!this.props.options) {
      return (
        <PanelCard title={this.props.title}>
          <p>{i18n('NO_FILTER_FOUND')}</p>
        </PanelCard>
      )
    }

    if (this.props.columnType === ColumnType.DATETIME) {
      return (
        <PanelCard title={this.props.title}>
          {!this.props.comparisonType && this.renderDateAutoGroup()}
          {this.isRangedFilter() && this.renderDateRangeGroup()}
          {this.isPartialRangeFilter() && this.renderDateGroup()}
        </PanelCard>
      )
    }

    const params = {
      placeholder: this.props.filterColumn ? i18n('SEARCH_FOR_FILTER', {filterName: this.props.filterColumn}) : i18n('SEARCH'),
      noOptionsText: i18n('NO_FILTER_FOUND'),
      clearLabel: this.props.hasAutoFill ? i18n('RESTORE_DEFAULT') : i18n('CLEAR_FILTER'),
    }

    return (
      <PanelCard title={this.props.title}
        // Overflow hidden is required to prevent the Filter Chips overflow from the PanelCard
        sx={{ overflow: 'hidden' }}>
        {this.props.singleChoice && this.renderSingleChoiceGroup(params)}
        {!this.props.singleChoice && this.renderMultipleChoiceGroup(params)}
      </PanelCard>
    )
  }
}
