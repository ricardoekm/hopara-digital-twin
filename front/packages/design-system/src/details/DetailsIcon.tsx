import React from 'react'
import { PureComponent } from '../component/PureComponent'
import { styled } from '@mui/system'
import { Box } from '@mui/system'

const IconBox = styled(Box)({
  display: 'grid',
  placeItems: 'center',
  width: '100%',
})

interface Props {
  icon: React.ReactNode
}

export class DetailsIcon extends PureComponent<Props> {
  render() {
    return <IconBox>{this.props.icon}</IconBox>
  }
}
