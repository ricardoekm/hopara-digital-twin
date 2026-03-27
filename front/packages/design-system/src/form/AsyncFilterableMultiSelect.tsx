import React from 'react'
import { Box, Chip } from '@mui/material'
import {AsyncFilterableSelect} from './AsyncFilterableSelect'

interface Props {
  showClearButton: 'TEXT' | 'BUTTON'
  values: string[]
  options: (string | {value?:any, label:string})[]
  onChange: (value?: string) => void
  onSearch: (searchValue: string) => void
  onClear: () => void
  noOptionsText?: string
  placeholder?: string
  clearLabel?: string
}

export const AsyncFilterableMultiSelect = (props: Props) => {
  const options = props.options.filter((o) => {
    if (typeof o === 'string') return !props.values.includes(o)
    return !props.values.includes(o.value)
  })
  return <Box
    sx={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: '1em',
    }}
  >
    <AsyncFilterableSelect
      showClearButton={props.showClearButton}
      clearLabel={props.clearLabel}
      clearAfterSelect
      options={options}
      onChange={props.onChange}
      onClear={props.onClear}
      onSearch={props.onSearch}
      placeholder={props.placeholder}
      noOptionsText={props.noOptionsText}
    />
    <Box sx={{
      display: 'flex',
      flexWrap: 'wrap',
      columnGap: 4,
      rowGap: 8,
    }}>
      {props.values.map((value, index) => {
        return <Chip
          key={index}
          label={String(value)}
          onDelete={() => props.onChange(value)}
        />
      })}
    </Box>
  </Box>
}
