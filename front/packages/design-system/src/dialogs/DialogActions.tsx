import React from 'react'
import {PureComponent} from '../component/PureComponent'
import { DialogActions as MuiDialogActions } from '@mui/material'

export class DialogActions extends PureComponent<any> {
  render() {
    return (
      <MuiDialogActions
        sx={{
          '&.MuiDialogActions-root': {
            justifyContent: 'center',
            gap: 4,
            marginBlockStart: 16,
          },
        }}
      >
        {this.props.children}
      </MuiDialogActions>
    )
  }
}
