import React from 'react'
import {SxProps} from '@mui/material'
import {ObjectListItem} from './ObjectListItem'
import { PureComponent } from '../component/PureComponent'
import {ListStyle} from './List'

interface Props {
  children?: React.ReactNode
  sx?: SxProps
  loading?: boolean
}

export class ObjectTypeList extends PureComponent <Props> {
  render() {
    return (
      <ListStyle sx={this.props.sx}>
        {this.props.loading && <>
          {new Array(3).fill(0).map((_, index) => {
            return <ObjectListItem key={index} loading/>
          })}
        </>}
        {this.props.children}
      </ListStyle>
    )
  }
}
