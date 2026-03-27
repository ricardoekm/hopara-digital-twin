import React from 'react'
import {PureComponent} from '../component/PureComponent'
import {styled} from '@mui/system'
import {Box} from '@mui/system'

const ImageBox = styled(Box, {name: 'ImageBox'})(({ theme }) => ({
  display: 'grid',
  placeItems: 'center',
  width: '100%',
  backgroundColor: theme.palette.background.default,
}))

interface Props {
  image: React.ReactNode
}

export class DetailsImage extends PureComponent<Props> {
  render() {
    return <ImageBox>{this.props.image}</ImageBox>
  }
}
