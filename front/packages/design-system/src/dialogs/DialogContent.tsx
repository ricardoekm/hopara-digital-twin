import React from 'react'
import {PureComponent} from '../component/PureComponent'
import { DialogContent as MuiDialogContent } from '@mui/material'

export class DialogContent extends PureComponent<any> {
  render() {
    return (
      <MuiDialogContent
        sx={{
          '&.MuiDialogContent-root': {
            padding: 0,
            textAlign: 'center',
          },
        }}
      >
        {this.props.children}
      </MuiDialogContent>
    )
  }
}
