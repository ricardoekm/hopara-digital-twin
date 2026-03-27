import React from 'react'
import {PureComponent} from '../component/PureComponent'
import {Box, InputLabel, InputProps, TextField as MuiTextField} from '@mui/material'
import {BaseTextFieldProps} from '@mui/material/TextField/TextField'
import debounce from 'lodash/fp/debounce'

export interface TextFieldProps extends Omit<BaseTextFieldProps, 'variant'> {
  valid?: boolean
  testId?: string
  onSetValue?: (value: string) => void
  InputProps?: Partial<InputProps>
  onChange?: (evt: React.ChangeEvent<HTMLTextAreaElement>) => void
  variant?: 'filled' | 'outlined'
  debounce?: number
  required?: boolean
  labelLayout?: 'horizontal' | 'vertical'
}

interface State {
  value?: string
  dirty: boolean
  isFocused?: boolean
}

export class TextField extends PureComponent<TextFieldProps, State> {
  debouncedOnChange: undefined | ((event: React.ChangeEvent<HTMLTextAreaElement>) => void)

  constructor(props: TextFieldProps) {
    super(props)
    this.state = {
      value: props.value as string,
      dirty: false,
    }
    this.debouncedOnChange = props.debounce ? debounce(props.debounce, (event) => {
      if (props.onChange) {
        props.onChange(event)
      }
    }) : undefined
  }

  componentDidUpdate(prevProps: Readonly<TextFieldProps>) {
    if (this.props.value !== prevProps.value) {
      this.setState({value: this.props.value as string})
    }
  }

  renderInput(ppp: Omit<TextFieldProps, 'labelLayout'>) {
    const inputHasError =
      ppp.error ??
      (ppp.required &&
        (ppp.valid === false || (this.state.dirty && ppp.value === '')))

    const {testId, onSetValue, ...rest} = ppp

    return (
      <MuiTextField
        {...rest}
        hiddenLabel
        label={undefined}
        variant={ppp.variant ?? 'filled'}
        size={ppp.size ?? 'small'}
        fullWidth={ppp.fullWidth ?? true}
        error={inputHasError}
        onFocus={() => this.setState({ isFocused: true })}
        onBlur={() => this.setState({ isFocused: false })}
        value={this.state.value ?? ''}
        onChange={(evt: React.ChangeEvent<HTMLTextAreaElement>) => {
          this.setState({dirty: true})
          if (onSetValue) onSetValue(evt.target.value)
          this.setState({value: evt.target.value})
          if (this.debouncedOnChange) {
            this.debouncedOnChange(evt)
          } else if (ppp.onChange) {
            ppp.onChange(evt)
          }
        }}
        inputProps={{
          ...ppp.inputProps,
          'data-testid': testId,
        }}
      />
    )
  }

  render() {
    const { labelLayout, ...rest} = this.props
    if (this.props.label) {
      return (
        <Box className='TextFieldWithLabel' sx={{
          display: 'grid',
          gridAutoFlow: labelLayout === 'vertical' ? 'row' : 'column',
          justifyItems: 'start',
          alignItems: 'center',
          gap: 8,
        }}>
          <InputLabel sx={{
            'fontWeight': 600,
            'fontSize': 13,
            '&::after': {
              content: this.props.required ? '"*"' : '""',
              color: (theme) => theme.palette.primary.main,
            },
          }}>{this.props.label}</InputLabel>
          {this.renderInput(rest)}
        </Box>
      )
    }

    return this.renderInput(rest)
  }
}
