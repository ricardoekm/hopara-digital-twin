import React from 'react'
import { styled } from './theme'
import { Typography, TypographyProps } from '@mui/material'
import { PureComponent } from './component/PureComponent'

export const TitleStyle = styled(Typography, { name: 'Title' })(
  ({ theme }) => ({
    color: theme.palette.text.primary,
    fontSize: '1.925em',
    fontWeight: '700',
    letterSpacing: '-0.26px',
    lineHeight: '2rem',
    whiteSpace: 'pre-line',
    transformOrigin: 'bottom center',
    textWrap: 'balance',
    margin: 0,
    display: 'flex',
    gap: '0.25em',
    placeItems: 'center',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.75em',
      margin: '0 auto',
    },
  }),
)

export class Title extends PureComponent <TypographyProps> {
  render() {
    return (
      <TitleStyle {...this.props} variant="h2">
        {this.props.children}
      </TitleStyle>
    )
  }
}
