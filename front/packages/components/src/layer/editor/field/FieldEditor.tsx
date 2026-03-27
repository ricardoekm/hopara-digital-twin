import React from 'react'
import {SelectOption} from '@hopara/design-system/src/form'
import {i18n} from '@hopara/i18n'
import { sortBy } from 'lodash'
import {PanelField} from '@hopara/design-system/src/panel/PanelField'
import { PureComponent } from '@hopara/design-system'
import {FilterableSelect} from '@hopara/design-system/src/form/FilterableSelect'
import { Columns } from '@hopara/dataset'

interface Props {
  title?: string
  options: SelectOption[]
  includeNullOption?: boolean
  nullOptionLabel?: string
  helperText?: string
  field?: string | null
  columns?: Columns
  onChange: (value: string) => void
  required?: boolean
  inline?: boolean
  layout?: 'inline' | 'toggle' | 'default'
  testId?: string
  disabled?: boolean
  hideUseField?: boolean
  nullField?: string
}

class FieldEditor extends PureComponent<Props> {
  constructor(props: Props) {
    super(props)
  }

  handleChange(event: any) {
    this.props.onChange(event.target.value)
  }

  getManagedPrefix() {
    return 'hopara_'
  }

  getFieldLabel(option:SelectOption) {
    if (this.props.hideUseField) {
      return option.label
    }

    if (option.label.startsWith(this.getManagedPrefix())) {
      return i18n('FIXED_FEMALE')
    }

    return i18n('USE_FIELD', {field: option.label})
  }

  isRequiredAndFieldNotSet() {
    return !this.props.field && this.props.required === true
  }

  isFieldSetAndNotOnColumns() {
    return this.props.field 
           && !this.props.field.startsWith(this.getManagedPrefix()) 
           && !this.props.columns?.has(this.props.field)
  }

  isComplexField() {
    return this.props.field && this.props.field.includes('.')
  }

  isFieldValid() {
    if (this.isRequiredAndFieldNotSet()) return false
    return !this.isFieldSetAndNotOnColumns() || this.isComplexField()
  }

  getErrorMessage() {
    if (this.isRequiredAndFieldNotSet()) return i18n('SELECT_A_FIELD')
    if (this.isFieldSetAndNotOnColumns() && !this.isComplexField()) return i18n('FIELD_NOT_FOUND_ON_THE_DATA_QUERY')
    return ''
  }

  getFieldOptions() {
    const fieldOptions = this.props.options.map((option) => ({
      value: option.value,
      label: this.getFieldLabel(option),
    }))

    const options = sortBy(fieldOptions, ['label'])

    if (this.props.includeNullOption) {
      options.unshift({
        value: this.props.nullField ?? undefined,
        label: this.props.nullOptionLabel ?? i18n('NONE'),
      })
    }

    if (this.isFieldSetAndNotOnColumns()) {
      options.unshift({
        value: this.props.field ? this.props.field : undefined,
        label: this.getFieldLabel({label: this.props.field!}),
      })
    }

    return options
  }

  render() {
    const SelectComp = <FilterableSelect
      testId={this.props.testId}
      error={!this.isFieldValid()}
      errorMessage={this.getErrorMessage()}
      value={this.props.field}
      options={this.getFieldOptions()}
      placeholder={this.props.nullOptionLabel ?? i18n('NONE')}
      onChange={this.handleChange.bind(this)}
      disabled={this.props.disabled}
      caseInsensitive={true}
    />

    if (this.props.title) {
      return (
        <PanelField
          layout={this.props.layout}
          title={this.props.title}
          helperText={this.props.helperText}
        >
          {SelectComp}
        </PanelField>
      )
    }

    return SelectComp
  }
}

export default FieldEditor
