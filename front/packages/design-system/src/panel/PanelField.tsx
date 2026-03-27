import React from 'react'
import {Box, SxProps, Typography, TypographyProps} from '@mui/material'
import {styled} from '../theme'
import {HelperButton} from '../HelperButton'
import { PureComponent } from '../component/PureComponent'

interface TitleProps extends TypographyProps {
  sx?: SxProps
  helperText?: React.ReactNode
}

const Title = (props: TitleProps) => {
  return (
    <Typography variant='h6' sx={{
      fontSize: '13px',
      fontWeight: 400,
      lineHeight: 1.25,
      display: 'flex',
      placeItems: 'center',
      gap: 5,
      ...props.sx,
    }}>
      {props.children}
      {props.helperText && <HelperButton description={props.helperText}/>}
    </Typography>
  )
}

const PanelFieldStyle = styled(Box, {name: 'PanelField'})(() => ({
  'display': 'grid',
  'gridTemplateColumns': 'auto',
  'gap': '0.5em',
  'alignItems': 'center',
  'minHeight': 38,
  '&.inline': {
    'gap': '0',
    'gridTemplateColumns': '1fr 2fr',
  },
  '&.toggle': {
      'gridTemplateColumns': '1fr auto',
    },
}))

interface Props {
  title?: string
  helperText?: React.ReactNode
  children: React.ReactNode
  layout?: 'inline' | 'toggle' | 'default',
  sx?: SxProps
}

export class PanelField extends PureComponent <Props> {
  render() {
    const title = <Title helperText={this.props.helperText}>{this.props.title}</Title>
    return <PanelFieldStyle className={this.props.layout} sx={this.props.sx}>
      {title}
      {this.props.children}
    </PanelFieldStyle>
  }
}
