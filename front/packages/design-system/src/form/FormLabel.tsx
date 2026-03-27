import React from 'react'
import { FormLabelProps } from '@mui/material'
import {PureComponent} from '../component/PureComponent'
import {FormLabel as MuiFormLabel} from '@mui/material'

export class FormLabel extends PureComponent<FormLabelProps> {
  render() {
    return <MuiFormLabel sx={{
      'fontWeight': 600,
      'fontSize': 13,
    }}>{this.props.children}</MuiFormLabel>
  }
}
