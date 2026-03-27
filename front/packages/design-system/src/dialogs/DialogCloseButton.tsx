import React from 'react'
import {PureComponent} from '../component/PureComponent'
import {IconButton} from '@mui/material'
import {Icon} from '../icons/Icon'

export class DialogCloseButton extends PureComponent<any> {
  render() {
    return (
      <IconButton
        onClick={this.props.onClick}
        sx={{ position: 'absolute', right: 4, top: 4 }}>
        <Icon icon='close'/>
      </IconButton>
    )
  }
}
