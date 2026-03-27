import {Box, Button, ButtonProps, SxProps} from '@mui/material'
import React from 'react'
import {PureComponent} from '../component/PureComponent'

interface Props extends ButtonProps {
  onClick: () => void
  icon?: React.ReactElement
  children: React.ReactNode
  active?: boolean
  sx?: SxProps
  testId?: string
}

export class ListActionButton extends PureComponent<Props> {
  render() {
    const hasIcon = !!this.props.icon
    let gridTemplateColumns = hasIcon ? '56px 1fr' : '1fr'
    if (this.props.size === 'medium') gridTemplateColumns = hasIcon ? '48px 1fr' : '1fr'
    if (this.props.size === 'small') gridTemplateColumns = hasIcon ? '32px 1fr' : '1fr'

    let padding = '8px 16px'
    if (this.props.size === 'medium') padding = '8px 12px'
    if (this.props.size === 'small') padding = '8px 8px'

    let height: string | undefined = '46px'
    if (this.props.size === 'medium') height = '40px'
    if (this.props.size === 'small') height = undefined

    const {testId, ...rest} = this.props

    return <Button
      {...rest}
      data-testid={testId}
      sx={{
        ...this.props.sx,
        'border': '1px solid',
        'borderColor': 'primary.main',
        'borderRadius': 2,
        'fontSize': 13,
        'lineHeight': 1.75,
        'color': this.props.active ? 'white' : 'primary.main',
        'backgroundColor': this.props.active ? 'primary.main' : 'transparent',
        '&:hover': {
          'backgroundColor': this.props.active ? 'primary.main' : 'inherit',
        },
        'width': '100%',
        'display': 'grid',
        'alignContent': 'center',
        'justifyItems': 'start',
        'alignItems': 'center',
        'textTransform': 'none',
        gridTemplateColumns,
        padding,
        height,
        'cursor': 'pointer',
      }}
      onClick={this.props.onClick}
    >
      {hasIcon && this.props.icon}
      <Box>
        {this.props.children}
      </Box>
    </Button>
  }
}
