import React from 'react'
import {PureComponent} from '../component/PureComponent'
import { DialogTitle as MuiDialogTitle } from '@mui/material'

export class DialogTitle extends PureComponent<any> {
  render() {
    return (
      <MuiDialogTitle
        sx={{
          fontWeight: 'bold',
          fontSize: 20,
          textAlign: 'center',
          color: 'text.primary',
          padding: 0,
          marginBlockStart: 16,
        }}
      >
        {this.props.children}
      </MuiDialogTitle>
    )
  }
}
