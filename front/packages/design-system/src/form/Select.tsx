import React from 'react'
import {AutocompleteRenderOptionState, FormControl, Select as MuiSelect, SxProps} from '@mui/material'
import {i18n} from '@hopara/i18n'
import {PureComponent} from '../component/PureComponent'
import MenuItem from '@mui/material/MenuItem'

export type SelectOption = {
  value?: string | number
  label: string
}

type Props = {
  id?: string
  value?: any
  options: (SelectOption | number | string)[]
  onChange: (e: { target: { value: any } }) => void
  disabled?: boolean
  testId?: string
  placeholder?: string
  isImage?: boolean
  noOptionsText?: React.ReactNode
  renderOption?: (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: any,
    state: AutocompleteRenderOptionState,
  ) => React.ReactNode;
  sx?: SxProps,
  enableCustomization?: boolean
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
    return o.value === value
  })

  return value
}

export class Select extends PureComponent<Props> {
  render() {
    const options = getOptions(this.props)
    const value = getValue(this.props, options)
    
    // Use native dropdown by default, or when customization is explicitly disabled
    const useNative = this.props.enableCustomization !== true
    
    if (useNative) {
      return <FormControl sx={{width: '100%'}}>
        <MuiSelect
          native
          data-testid={this.props.testId}
          variant="filled"
          value={value?.value}
          fullWidth
          disabled={this.props.disabled}
          onChange={(e) => {
            const value = getTargetValue({value: e.target.value})
            this.props.onChange({target: {value}})
          }}
          sx={{
            maxWidth: '100%',
            ['select']: {
              display: this.props.renderOption ? 'flex' : undefined,
              padding: '8px 12px',
              gap: '0.5em',
              alignItems: 'center',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            },
          }}
        >
          {options.map((option) => {
            return <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          })}
        </MuiSelect>
      </FormControl>
    }

    return <FormControl sx={{width: '100%'}}>
      <MuiSelect
        data-testid={this.props.testId}
        variant="filled"
        value={value?.value}
        displayEmpty={true}
        disabled={this.props.disabled}
        renderValue={this.props.renderOption ? undefined : (selected) => {
          if (!selected) {
            return this.props.placeholder ?? i18n('SELECT_ELLIPSIS')
          }
          return options.find((o) => o.value === selected)?.label
        }}
        fullWidth
        onChange={(e) => {
          const value = getTargetValue({value: e.target.value})
          this.props.onChange({target: {value}})
        }}
        sx={{
          maxWidth: '100%',
          ['[role="combobox"]']: {
            display: this.props.renderOption ? 'flex' : undefined,
            padding: this.props.isImage ? 0 : '8px 12px',
            gap: '0.5em',
            alignItems: 'center',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          },
          ...this.props.sx ?? {},
        }}
      >
        {options.map((option) => {
          if (this.props.renderOption) {
            return this.props.renderOption({}, option, {selected: false} as any)
          }
          return <MenuItem
            key={option.value}
            value={option.value}
            data-value={option.value}
            data-label={option.label}
          >
            {option.label}
          </MenuItem>
        })}
      </MuiSelect>
    </FormControl>
  }
}
