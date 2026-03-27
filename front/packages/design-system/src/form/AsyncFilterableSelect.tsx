import React, {useEffect, useRef, useState} from 'react'
import {Autocomplete, Box, CircularProgress} from '@mui/material'
import {AutocompleteRenderInputParams, AutocompleteRenderOptionState} from '@mui/material/Autocomplete/Autocomplete'
import Button from '@mui/material/Button'
import {TextField} from './TextField'

interface Props {
  value?: string
  onChange: (value?: string) => void
  options: (string | {value?:any, label:string})[]
  loading?: boolean
  onSearch?: (searchValue: string) => void
  noOptionsText?: string
  placeholder?: string
  showClearButton?: 'TEXT' | 'BUTTON'
  renderInput?: (params: AutocompleteRenderInputParams) => React.ReactNode;
  renderOption?: (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: any,
    state: AutocompleteRenderOptionState,
    ownerState: any,
  ) => React.ReactNode;
  onClear?: () => void
  clearLabel?: string
  clearAfterSelect?: boolean
  startAdornment?: React.ReactNode
  onHighlightChange?: (option: string | undefined) => void
}

export const AsyncFilterableSelect = (props: Props) => {
  const [value, setValue] = useState<string | undefined | null>(props.value ?? null)
  const [inputValue, setInputValue] = useState('')
  const [firstRender, setFirstRender] = useState(true)
  const autocompleteRef = useRef<any>(null)

  const handleClear = () => {
    setValue(null)
    setInputValue('')
    if (autocompleteRef.current) {
      autocompleteRef.current.blur()
    }
    props.onClear?.()
  }

  useEffect(() => {
    if (inputValue && firstRender) {
      setFirstRender(false)
      return
    }
    if (value !== inputValue) {
      props.onSearch?.(inputValue)
    }
  }, [inputValue])

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '1em',
      }}
    >
      {props.showClearButton === 'TEXT' &&
        <Button
          onClick={() => {
            handleClear()
          }}
          sx={{
            position: 'absolute',
            top: -30,
            right: 0,
            fontSize: 11,
            padding: 5,
          }}
        >
          {props.clearLabel}
        </Button>
      }
      <Autocomplete
        disableClearable={props.showClearButton !== 'BUTTON'}
        filterOptions={(x) => x}
        value={value as any}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          if (inputValue !== newInputValue) {
            setInputValue(newInputValue)
          }
        }}
        options={props.options}
        ref={autocompleteRef}
        onChange={(event: any, newValue?: {value?:string} | string | null) => {
          const value = newValue && typeof newValue === 'object' && 'value' in newValue ? newValue?.value : (newValue as string ?? undefined)
          props.onChange(value)
          if (props.onHighlightChange) props.onHighlightChange(undefined)
          if (!props.clearAfterSelect) {
            setValue(value)
            props.onSearch?.('')
          } else {
            setValue(null)
            setInputValue('')
            props.onSearch?.('')
          }
        }}
        renderInput={props.renderInput ?? ((params) => (
          <TextField
            {...params}
            placeholder={props.placeholder}
            fullWidth
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {props.loading ? <CircularProgress color="inherit" size={20}/> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
              startAdornment: props.startAdornment,
            }}
          />
        ))}
        renderOption={props.renderOption ? props.renderOption : (_props, option) => {
          const value = option?.value ?? option
          const label = option?.label ?? option
          return <Box component="li" {..._props} key={value} data-value={value} data-label={label}>{label}</Box>
        }}
        onHighlightChange={(event, option) => {
          if (props.onHighlightChange) props.onHighlightChange(option)
        }}
        onClose={() => {
          if (props.onHighlightChange) props.onHighlightChange(undefined)
        }}
      />
    </Box>
  )
}


