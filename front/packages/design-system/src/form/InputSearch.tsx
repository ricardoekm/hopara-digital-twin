import React from 'react'
import {InputAdornment} from '@mui/material'
import {TextField} from './TextField'
import {PureComponent} from '../component/PureComponent'
import {Icon} from '../icons/Icon'

type props = {
  value?: string
  initialValue?: string
  onChange?: Function
  onSubmit?: Function
  onFocus?: Function
  onBlur?: Function
  placeholder?: string
  className?: string
  inputClassName?: string
  variant?: 'outlined' | 'filled'
  autoFocus?: boolean
}

type state = {
  value?: string
}

export class InputSearch extends PureComponent<props, state> {
  constructor(props) {
    super(props)
    this.state = {
      value: this.props.initialValue ? this.props.initialValue : this.props.value,
    }
  }

  componentDidUpdate(prevProps: Readonly<props>): void {
    if (prevProps.initialValue !== this.props.initialValue) {
      this.setState({value: this.props.initialValue})
    }
  }

  getValue() {
    return this.props.value || this.state.value || ''
  }

  handleChange(e) {
    if (!this.props.value) {
      this.setState({value: e.target.value})
    }

    return this.props.onChange && this.props.onChange(e)
  }

  render(): React.ReactNode {
    return (
      <TextField
        variant={this.props.variant}
        autoFocus={this.props.autoFocus}
        fullWidth={true}
        value={this.getValue()}
        placeholder={this.props.placeholder}
        onFocus={(e) => this.props.onFocus && this.props.onFocus(e)}
        onBlur={(e) => this.props.onBlur && this.props.onBlur(e)}
        onChange={(e) => this.handleChange(e)}
        autoComplete='off'
        InputProps={{
          sx: {
            borderRadius: 100,
            paddingInlineStart: 5,
            maxHeight: 32,
          },
          startAdornment: <InputAdornment position="start" sx={{margin: 'auto 1px auto 0'}}>
            <Icon icon="search-input"/>
          </InputAdornment>,
        }}
      />
    )
  }
}

