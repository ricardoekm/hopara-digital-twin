import React from 'react'
import {Autocomplete, Box, Popper} from '@mui/material'
import {i18n} from '@hopara/i18n'
import {TextField} from './TextField'
import {PureComponent} from '../component/PureComponent'

export type SelectOption = {
  value?: string | number
  label: string | React.ReactNode
}

type Props = {
  id?: string
  value?: any
  options: (SelectOption | number | string)[]
  onChange: (e: { target: { value: any } }) => void
  error?: boolean
  errorMessage?: string
  disabled?: boolean
  testId?: string
  caseInsensitive?: boolean
  placeholder?: string
  noOptionsText?: React.ReactNode
  onOpen?: () => void
}

const NONE = '__NONE__'

function isNone(value: any) {
  return value === undefined || value === null || value === ''
}

const getTargetValue = (selectedOption: { value: string } | string) => {
  const value = (typeof selectedOption === 'string') ? selectedOption : selectedOption?.value
  if (value === NONE) return undefined
  return value
}

const getOptions = (props: Props) => {
  return (props.options ?? []).map((o) => {
    if (typeof o === 'string' || typeof o === 'number' || typeof o === 'boolean') {
      return {
        value: o,
        label: o.toString(),
      }
    }
    if (isNone(o)) {
      return {
        value: NONE,
        label: i18n('NONE'),
      }
    }
    if (o.label && isNone(o.value)) {
      return {
        value: NONE,
        label: o.label,
      }
    }
    return o
  })
}

const getValue = (props: Props, options: SelectOption[]) => {
  let value = props.value

  if (isNone(value)) {
    value = NONE
  }

  value = options.find((o) => {
    if (props.caseInsensitive && typeof o.value === 'string' && typeof value === 'string') {
      return o.value.toLowerCase() === value.toLowerCase()
    }

    return o.value === value
  })

  return value
}

export class FilterableSelect extends PureComponent<Props> {
  render() {
    const options = getOptions(this.props)
    const value = getValue(this.props, options)

    return <Autocomplete
      blurOnSelect
      clearOnBlur
      key={this.props.id}
      options={options}
      value={value ?? null}
      disabled={this.props.disabled}
      disableClearable
      onOpen={this.props.onOpen}
      onChange={(e, selectedOption) => {
        const value = getTargetValue(selectedOption)
        this.props.onChange({target: {value}})
      }}
      renderOption={(_props, option) => {
        return <Box component="li" {..._props} key={option.value} data-value={option.value} data-label={option?.label}>
          {option?.label}
        </Box>
      }}
      noOptionsText={this.props.noOptionsText}
      renderInput={(params) => (
        <TextField
          {...params}
          error={this.props.error}
          helperText={this.props.error ? this.props.errorMessage : ''}
          placeholder={this.props.placeholder ?? i18n('SELECT_ELLIPSIS')}
          sx={{
            '& input': {
              cursor: 'pointer',
            },
            '& input:focus': {
              cursor: 'text',
            },
          }}
          InputProps={{
            ...params.InputProps,
            'data-testid': this.props.testId,
          } as any}
        />
      )}
      PopperComponent={(_props) => (
        <Popper
          {..._props}
          sx={{
            '& .MuiListSubheader-root': {
              textTransform: 'uppercase',
              borderBottom: '1px solid #efefef',
            },
          }}
        >
          {_props.children}
        </Popper>
      )}
    />
  }
}


