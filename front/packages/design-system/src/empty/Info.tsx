import React from 'react'
import { Box, Typography } from '@mui/material'
import { styled, Theme, withTheme } from '../theme'
import { Icon } from '../icons/Icon'
import { PureComponent } from '../component/PureComponent'

interface Props {
  description: React.ReactNode
  icon?: React.ReactNode
  theme: Theme
  noBorder?: boolean
}

const InfoStyle = styled(Box, { name: 'Info' })(({ theme }) => ({
  'alignItems': 'center',
  'border': `1px solid ${theme.palette.spec.borderColor}`,
  'borderRadius': '6px',
  'display': 'grid',
  'gap': 16,
  'gridTemplateColumns': 'auto 1fr',
  'padding': '12px 16px',
  'textAlign': 'left',
  'marginBlock': 12,

  '&.noBorder': {
    border: 'none',
  },
}))

const InfoDescription = styled(Typography, { name: 'InfoDescription' })({
  lineHeight: '1.5em',
})

class InfoClass extends PureComponent<Props> {
  render() {
    const { description, icon, theme, noBorder, ...rest } = this.props
    return (
      <InfoStyle
        className={noBorder ? 'noBorder' : ''}
        {...rest}
      >
        {icon ?? <Icon icon="helper" color={theme.palette.spec.primary} />}
        <InfoDescription
          variant="subtitle1"
        >
          {description}
        </InfoDescription>
      </InfoStyle>
    )
  }
}

export const Info = withTheme<Props>(InfoClass)
